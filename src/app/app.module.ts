import { NgModule } from '@angular/core';

import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import 'hammerjs';
import { NgxSpinnerModule } from "ngx-spinner";


import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { OrderModule } from './order/order.module';
import { RateEditComponent } from './rate/rate-edit/rate-edit.component';
import { AppHttpInterceptor } from './interceptor/app-http.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { InvoiceComponent } from './print/invoice/invoice.component';
import { PrintLayoutComponent } from './print/print-layout/print-layout.component';

@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		LoginComponent,
		RateEditComponent,
		InvoiceComponent,
		PrintLayoutComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		FlexLayoutModule,
		HttpClientModule,
		AppRoutingModule,
		MatButtonModule,
		MatToolbarModule,
		MatSidenavModule,
		MatIconModule,
		MatListModule,
		MatDatepickerModule,
		MatMomentDateModule,
		MatFormFieldModule,
		MatInputModule,
		MatRadioModule,
		MatSelectModule,
		NgxSpinnerModule,
		OrderModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
	],
	providers: [
		Title,
		{ provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
