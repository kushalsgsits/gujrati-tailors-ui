import { Component, OnInit } from '@angular/core';
import { OrderFilter } from '../order-filter';
import { OrderService } from '../order.service';
import { Order } from '../order';

@Component({
	selector: 'app-order',
	templateUrl: 'order-list.component.html'
})
export class OrderListComponent implements OnInit {

	filter = new OrderFilter();
	selectedOrder: Order;
	feedback: any = {};

	get orderList(): Order[] {
		return this.orderService.orderList;
	}

	constructor(private orderService: OrderService) {
	}

	ngOnInit() {
		this.search();
	}

	search(): void {
		this.orderService.load(this.filter);
	}

	select(selected: Order): void {
		this.selectedOrder = selected;
	}

	delete(order: Order): void {
		if (confirm('Are you sure?')) {
			this.orderService.delete(order).subscribe(() => {
				this.feedback = { type: 'success', message: 'Delete was successful!' };
				setTimeout(() => {
					this.search();
				}, 1000);
			},
				err => {
					this.feedback = { type: 'warning', message: 'Error deleting.' };
				}
			);
		}
	}
}
