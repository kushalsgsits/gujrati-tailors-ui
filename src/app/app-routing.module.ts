import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateEditComponent } from './rate/rate-edit/rate-edit.component';
import { LoginComponent } from './login/login.component';
import { PrintLayoutComponent } from './print/print-layout/print-layout.component'
import { InvoiceComponent } from './print/invoice/invoice.component'
import { OrderListComponent } from './order/order-list/order-list.component'

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'rates',
		component: RateEditComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'print',
		outlet: 'print',
		component: PrintLayoutComponent,
		children: [
			{ path: 'invoice/:orderId', component: InvoiceComponent }
		],
		canActivate: [AuthGuard]
	}
];


@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
