import { Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderEditComponent } from './order-edit/order-edit.component';

export const ORDER_ROUTES: Routes = [
  {
    path: 'orders',
    component: OrderListComponent
  },
  {
    path: 'orders/:id',
    component: OrderEditComponent
  }
];
