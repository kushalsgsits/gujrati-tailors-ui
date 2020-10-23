import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { OrderService } from './order.service';
import { ItemService } from '../item/item.service';
import { ORDER_ROUTES } from './order.routes';

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
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';

import { NgxSpinnerModule } from "ngx-spinner";
import { OrderStatusEditDialogComponent } from './order-status-edit-dialog/order-status-edit-dialog.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		FlexLayoutModule,
		RouterModule.forChild(ORDER_ROUTES),
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
		MatTableModule,
		MatExpansionModule,
		MatTabsModule,
		MatMenuModule,
		NgxSpinnerModule
	],
	declarations: [
		OrderListComponent,
		OrderEditComponent,
		OrderStatusEditDialogComponent
	],
	providers: [OrderService, ItemService],
	exports: []
})
export class OrderModule { }
