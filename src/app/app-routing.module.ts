import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateEditComponent } from './rate/rate-edit/rate-edit.component';
import { LoginComponent } from './login/login.component';
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
];


@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
