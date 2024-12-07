import {Routes} from '@angular/router';
import {BillEditComponent} from './bill-edit/bill-edit.component';
import {BillListComponent } from './bill-list/bill-list.component';
import {AuthGuard} from '../auth/auth.guard';

export const STUDIO_ROUTES: Routes = [
  {
    path: 'studio/bills',
    component: BillListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'studio/bills/:id',
    component: BillEditComponent,
    canActivate: [AuthGuard]
  }
];
