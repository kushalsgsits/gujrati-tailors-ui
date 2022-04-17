import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../print.service';
import { OrderService } from '../../order/order.service'
import { ItemService } from '../../item/item.service'
import { Order, SelectItemGroup } from '../../order/order';
import { getSelectItem, calcOrderTotalUtil } from './../../utils';

@Component({
	selector: 'app-invoice',
	templateUrl: './invoice.component.html',
	styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
	orderId: string;
	copies: string[] = ['Customer Copy', 'Shop Copy'];
	order: Order;
	groupedItemsWithRate: SelectItemGroup[];

	constructor(route: ActivatedRoute,
		private printService: PrintService,
		private orderService: OrderService,
		private itemService: ItemService) {
		let selfUrl = route.snapshot.params['orderId'];
    this.orderId = selfUrl.substring(selfUrl.lastIndexOf('/') + 1);
    console.log('orderId from selfUrl in InvoiceComponent', this.orderId);
	}

	ngOnInit() {
		this.orderService.findById(this.orderId).subscribe(
			order => {
				this.order = order;
				this.itemService.getGroupedItemsWithRate().subscribe(
					groupedItemsWithRate => {
						this.groupedItemsWithRate = groupedItemsWithRate;
						this.printService.onDataReady();
					},
					errRes => {
						alert(errRes.shortErrorMsg);
					}
				);
			},
			errRes => {
				alert(errRes.shortErrorMsg);
			})
	}

	getItemDispValue(itemId: string) : string {
		return getSelectItem(itemId, this.groupedItemsWithRate).name;
	}

	calcOrderTotal() {
		return calcOrderTotalUtil(this.order);
	}

}
