import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderFormComponent } from './order-form/order-form.component';
import { OrderListComponent } from './order-list/order-list.component';

const routes: Routes = [
    {
        path:'order-form',
        component: OrderFormComponent
    },
    {
        path:'order-list',
        component: OrderListComponent
    },
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    }     
];


@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
