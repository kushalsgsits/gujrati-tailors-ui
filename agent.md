# Gujrati Tailors — UI

Angular single-page app for a tailor shop's order management. Talks to the
`gujrati-tailors-backend` REST API and is hosted as static files on Google App Engine.
This document is a permanent, tool-agnostic guide for any developer or AI assistant working
in this repo.

## Tech stack

- **Angular**: 9.1.7 (Angular CLI 9), TypeScript ~3.8
- **UI**: Angular Material 9.2.3 + `@angular/flex-layout`, theme `deeppurple-amber`
- **State/HTTP**: RxJS 6.5, `HttpClient` with a global interceptor
- **Dates**: moment + `@angular/material-moment-adapter`
- **UX**: `ngx-spinner` for loading; `MatSnackBar` on Update Rates screen; `@angular/service-worker` (PWA, prod only)

## How to run

```bash
npm install            # postinstall runs patch-webpack-md4.js (Node compat for MD4 hashing)
npm start              # ng serve -> http://localhost:4200 (backend at localhost:8080)
npm run start:prod-be  # ng serve -> http://localhost:4200 (backend at GAE prod URL)
npm run build:prod     # AOT prod build -> dist/gujrati-tailors-ui (enables service worker)
```

## Deploy to Google App Engine

Static SPA hosted on GAE (Python runtime shell; files served from `gujrati-tailors-ui/`).

| Item | Value |
|------|--------|
| GCP project | `gujratitailors` |
| Prod URL | https://gujratitailors.appspot.com |
| Config | `app.yaml` (repo root) |
| API target | `environment.prod.ts` → `https://gujrati-tailors-backend.el.r.appspot.com/` |

Legacy `gs://gujrati-tailors-ui-bucket/` is unused by this flow (left as-is in GCP).

```bash
# Prepare deploy bundle only (build + copy dist → gujrati-tailors-ui/)
npm run prepare:deploy

# Build, stage, deploy to GAE
npm run deploy
```

`deploy.sh`: `npm run build:prod` → copy `dist/gujrati-tailors-ui` to `gujrati-tailors-ui/` → `gcloud app deploy app.yaml --project=gujratitailors`.

`app.yaml` references `gujrati-tailors-ui/` (staged build output), not `dist/` directly. That folder is gitignored.

## Backend integration

- Base URL via Angular file replacements:
  - `environment.ts` — local backend (`http://localhost:8080/`), default for `npm start`
  - `environment.local-prod.ts` — prod backend while running `ng serve` (`npm run start:prod-be`)
  - `environment.prod.ts` — prod backend + prod build flags (`npm run build:prod`)
- `AppHttpInterceptor` attaches `Authorization: Bearer <jwt>`, JSON headers; logs out on 401.

| Method | Endpoint | Caller |
|--------|----------|--------|
| POST | `authenticate` | `LoginComponent` |
| GET | `items/groupedItems` | `ItemService.getGroupedItemsWithRate()` — order-edit, order-list, invoice, **Update Rates** |
| POST | `rates` | `ItemService.save()` — **Update Rates** screen only |
| GET | `orders/{id}` | `OrderService.findById()` |
| GET | `orders/customSearch` | `OrderService.find()` |
| POST / PUT / DELETE | `orders` / `orders/{id}` | `OrderService` |

Spring Data REST / HATEOAS for orders (`_embedded.orders`, `_links.self.href`).

## App structure

```
src/app
├── app.module.ts            # Declares Login, Dashboard, RateEditComponent, Invoice, PrintLayout
├── app-routing.module.ts    # /login, /rates, print outlet
├── app.component.*          # Toolbar + sidenav nav, logout, router outlets
├── auth/                    # AuthService (JWT in localStorage), AuthGuard
├── interceptor/             # AppHttpInterceptor
├── login/
├── order/                   # OrderModule; provides OrderService, ItemService
│   ├── order-edit/          # Create/edit order: item picker, qty x rate, total, print
│   └── order-list/
├── item/item.service.ts     # GET grouped items; POST rate overrides
├── rate/rate-edit/          # Update Rates screen (RateEditComponent)
├── print/                   # Invoice (customer & shop copy)
├── utils.ts                 # getSelectItem, removeSafariShirt, calcOrderTotalUtil, extractOrderId
└── dashboard/               # Stub (not in nav)
```

### Routes & navigation

| Screen | Route | Auth |
|--------|-------|------|
| Login | `/login` | Public |
| Create Order | `/orders/new` | Protected |
| Edit Order | `/orders/:id` | Protected |
| Orders List | `/orders` | Protected |
| **Update Rates** | `/rates` | Protected |
| Print Invoice | print outlet `/print/invoice/:orderId` | Protected |

Default landing: `/orders/new`.

Nav links in `app.component.html`: **Create Order**, **Orders List**, **Update Rates**.

## Update Rates feature (important)

Screen: `RateEditComponent` at route `/rates` (`rate/rate-edit/`).

**Purpose:** Shop owner updates item rates at runtime without redeploying the backend.

**Flow:**

1. Load catalog via `GET items/groupedItems` (grouped by category, includes effective rates).
2. Build reactive form: one `FormArray` per group; each row is `{ id, name (disabled), rate }`.
3. `removeSafariShirt()` hides `safariShirt` (same as order screens).
4. On submit: `POST rates` with `{ rates: { itemId: rate, ... } }` built from form rows by `id`.
5. On success: stay on page, show **MatSnackBar** success, **re-fetch** `groupedItems` (refreshes service-worker cache entry).
6. On error: snackbar with `errorMessage` from backend.

**Look & feel:** Reuses order-edit rate field markup and global `styles.css` — no component CSS file:

```html
<div class="item-rates">
  <mat-form-field appearance="outline" class="item-form-field">
    <mat-label>{{ item name }}</mat-label>
    <input matInput formControlName="rate" type="number" min="0" max="9999">
    <span matPrefix>&#x20B9;&nbsp;</span>   <!-- after input, like order-edit -->
  </mat-form-field>
</div>
```

- Field labels show **item name only** (no "Rate" suffix — page title is enough).
- Validation: integer **0–9999** (`Validators.pattern('[\\d]{1,4}')`).
- `RateEditComponent` is declared in **`AppModule`** (not a separate feature module).

## Items & rates flow (all screens)

- `SelectItem` carries `rate`. Catalog from `ItemService.getGroupedItemsWithRate()`.
- **order-edit:** default line rate on item add (from catalog); per-line rate editable; total = `sum(qty * rate)`.
- **order-list / invoice:** resolve item display names from catalog; totals from snapshotted order line rates.
- **Update Rates:** edits catalog defaults (via backend overrides); does not change existing orders.
- `removeSafariShirt()` hides `safariShirt` from picker and rate form.
- Coat group disabled on order-edit when `orderType === 'REGULAR'`.
- Service worker caches `**/groupedItems` (~1 day, freshness/network-first). After a rate save, the Update Rates screen re-fetches to overwrite the cache; other screens get fresh data on next online fetch.

## Auth flow

- Login -> JWT in `localStorage` (`gujrati-tailors-jwt`). `isLoggedIn()` checks presence only.
- No role-based UI restrictions — any logged-in user can reach Update Rates.

## Conventions & gotchas

- Reactive forms; Material `appearance="outline"`; layout from global `src/styles.css` (component CSS files mostly empty).
- Order screens still use `alert(...)` for success/errors; Update Rates uses **MatSnackBar**.
- `OrderListComponent` uses `MatDialog` but `MatDialogModule` may not be imported — pre-existing issue on order list, not rate feature.
- Invoice template uses cosmetic `<b>` formatting (user-maintained).
- Temporary task notes may exist in backend repo `rate-self-service-intent.md` (delete after merge).
