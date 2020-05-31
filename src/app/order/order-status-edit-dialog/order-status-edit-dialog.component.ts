import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from "ngx-spinner";
import { OrderService } from '../order.service';
import { Order, orderStatuses } from '../order';

export interface DialogData {
	order: Order;
}

@Component({
	selector: 'app-order-status-edit-dialog',
	templateUrl: './order-status-edit-dialog.component.html',
	styleUrls: ['./order-status-edit-dialog.component.css']
})
export class OrderStatusEditDialogComponent implements OnInit {

	// constants
	orderStatusesArray: string[] = orderStatuses;

	constructor(
		public dialogRef: MatDialogRef<OrderStatusEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
		private orderService: OrderService,
		private spinner: NgxSpinnerService) {
	}

	ngOnInit(): void {
	}

	save() {
		this.spinner.show();
		this.orderService.save(this.data.order).subscribe(
			order => {
				this.spinner.hide();
				this.dialogRef.close();
			},
			errResponse => {
				this.spinner.hide();
				this.dialogRef.close();
				alert(errResponse.shortErrorMsg);
			}
		);
	}

	cancel(): void {
		this.dialogRef.close();
	}
}
