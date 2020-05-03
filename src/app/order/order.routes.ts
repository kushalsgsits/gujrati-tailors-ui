import { Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { AuthGuard } from '../auth/auth.guard';

export const ORDER_ROUTES: Routes = [
	{
		path: 'orders',
		component: OrderListComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'orders/:id',
		component: OrderEditComponent,
		canActivate: [AuthGuard]
	},
	{
		path: '**',
		redirectTo: 'orders/new',
	}
];
