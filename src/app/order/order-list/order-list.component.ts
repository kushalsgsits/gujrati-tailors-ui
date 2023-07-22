import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router'
import { OrderService } from '../order.service';
import { ItemService } from '../../item/item.service';
import { PrintService } from '../../print/print.service';
import {Order, itemTypes, orderStatuses, SelectItemGroup, SelectItem, orderTypes} from '../order';
import { calcOrderTotalUtil } from '../../utils';
import { OrderStatusEditDialogComponent } from '../order-status-edit-dialog/order-status-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgxSpinnerService } from "ngx-spinner";

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';
import {MatTabChangeEvent} from "@angular/material/tabs";

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
	parse: {
		dateInput: 'LL',
	},
	display: {
		dateInput: 'DD-MMM-YYYY',
		monthYearLabel: 'MMM YYYY',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'MMMM YYYY',
	},
};

@Component({
	selector: 'app-order',
	templateUrl: 'order-list.component.html',
	styleUrls: ['order-list.component.css'],
	providers: [
		// `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
		// application's root module. We provide it at the component level here, due to limitations of
		// our example generation script.
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
		},

		{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
	],
	animations: [
		trigger('detailExpand', [
			state('collapsed', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	],
})
export class OrderListComponent implements OnInit {

	// constants
	itemTypesArray: string[] = itemTypes;
	itemIdToItemMap: any;
	orderStatusesArray: string[] = orderStatuses;
  orderTypesArray: string[] = orderTypes;

	// results
	orderList: Order[] = [];
	ordersSummary: any = {};

	// request related
	filterForm: FormGroup;
  currentTab = 0;

	// display related
	isFilterPanelExpanded: boolean = false;
	columnsToDisplay = ['orderNumber', 'name', 'deliveryDate', 'actions'];
	expandedElement: Order | null;
	feedback: any = {};
	isPrinting = false;

	constructor(
		private orderService: OrderService,
		private fb: FormBuilder,
		private router: Router,
		private spinner: NgxSpinnerService,
		private dialog: MatDialog,
		private itemService: ItemService,
		private printService: PrintService) {
	}

	ngOnInit() {
    // TODO fix spinner in inOnInit
		this.itemService.getGroupedItemsWithRate().subscribe(
			groupedItemsWithRate => {
				this.initItemIdToItemMap(groupedItemsWithRate);
				this.initFilterForm();
				this.search();
			},
			errRes => {
				alert(errRes.errorMessage);
			}
		);
	}

	initFilterForm() {
    this.filterForm = this.currentTab == 0 ? this.createFormGroupForTab0() : this.createFormGroupForTab1();
	}

  private createFormGroupForTab0() {
    const formGroup = this.fb.group({
      deliveryDateStart: [moment().set('h', 0).set('m', 0).set('s', 0).set('ms', 0)],
      deliveryDateEnd: [moment().add(1, "M").set('h', 0).set('m', 0).set('s', 0).set('ms', 0)],
      orderType: [''],
      orderNumber: ['', Validators.pattern('[\\d]{1,4}')],
      orderStatus: [''],
      mobile: ['', Validators.pattern('[\\d]{10}$')],
      sort: ["deliveryDate,ASC"],
      size: ['200']
    });
    console.log("Called createFormGroup-Tab#0", this.filterForm);
    return formGroup;
  }

  private createFormGroupForTab1() {
    const formGroup = this.fb.group({
      deliveryDateStart: [moment().subtract(1, "y").set('h', 0).set('m', 0).set('s', 0).set('ms', 0)],
      deliveryDateEnd: [moment().add(2, "M").set('h', 0).set('m', 0).set('s', 0).set('ms', 0)],
      orderType: [''],
      orderNumber: ['', Validators.pattern('[\\d]{1,4}')],
      orderStatus: [''],
      mobile: ['', Validators.pattern('[\\d]{10}$')],
      sort: ["deliveryDate,DESC"],
      size: ['5']
    });
    console.log("Called createFormGroup-Tab#1", this.filterForm);
    return formGroup;
  }

	onReset() {
		this.feedback = {};
    this.initFilterForm();
	}

	onSubmit() {
		this.feedback = {};
		this.closeFilterPanel();
		this.search();
	}

  onTabChanged(event: MatTabChangeEvent) {
    this.currentTab = event.index;
    this.initFilterForm();
  }

	onCancel() {
		this.feedback = {};
		this.closeFilterPanel();
	}

	search(): void {
		this.spinner.show();
		console.log("filterForm", this.filterForm)
		this.orderService.load(this.filterForm.value).subscribe(
			result => {
				this.orderList = [];
				if (result._embedded && result._embedded.orders) {
          this.orderList = result._embedded.orders
        }
				this.createSummary();
				this.spinner.hide();
			},
			errResponse => {
				this.orderList = [];
				this.ordersSummary = {};
				this.spinner.hide();
				alert(errResponse.errorMessage);
			}
		);
	}

	delete(order: Order): void {
		if (confirm('Are you sure?')) {
			this.orderService.delete(order).subscribe(
				() => {
					this.search();
				},
				errResponse => {
					alert(errResponse.errorMessage);
				}
			);
		}
	}

	edit(order: Order): void {
		let id  = this.extractOrderId(order)
		this.router.navigate(['/orders', id]);
	}

	printInvoice(order: Order): void {
		this.printService.printDocument('invoice', order._links.self.href);
	}

	printOrderList() {
		this.isPrinting = true;
		setTimeout(() => {
			console.log('Printing OrderList');
			window.print();
			this.isPrinting = false;
		});
	}

	closeFilterPanel() {
		this.isFilterPanelExpanded = false;
	}

	expandTableRow(order: Order) {
		this.expandedElement = this.expandedElement === order ? null : order;
	}

	isTableRowExpanded(order: Order): boolean {
		return this.expandedElement === order || this.isPrinting;
	}

	openOrderStatusDialog(order: Order) {
		this.dialog.open(OrderStatusEditDialogComponent, {
			data: { order: order }
		});
	}

	private createSummary() {
		this.ordersSummary = {};
		if (!(this.orderList && this.orderList.length > 0)) {
			return;
		}
    let orderAmount = 0;
		this.orderList.forEach(
			order => {
        orderAmount += this.calcOrderTotal(order);
				order.orderItems.forEach(
					orderItem => {
						let itemCount = orderItem.quantity;
						let item: SelectItem = this.itemIdToItemMap[orderItem.id];
						if (item.type === 'Combo') {
							item.comboItemIds.forEach(
								comboItemId => {
									let itemType = this.itemIdToItemMap[comboItemId].type;
									if (this.ordersSummary[itemType]) {
										this.ordersSummary[itemType] += itemCount;
									} else {
										this.ordersSummary[itemType] = itemCount;
									}
								}
							)
						} else {
							if (this.ordersSummary[item.type]) {
								this.ordersSummary[item.type] += itemCount;
							} else {
								this.ordersSummary[item.type] = itemCount;
							}
						}
					}
				);
			}
		);
    this.ordersSummary['orderAmount'] = orderAmount;
	}

	private initItemIdToItemMap(groupedItemsWithRate: SelectItemGroup[]) {
		this.itemIdToItemMap = {};
		groupedItemsWithRate.forEach(
			group => {
				group.groupItems.forEach(
					item => {
						this.itemIdToItemMap[item.id] = item;
					}
				)
			}
		)
		console.log('itemIdToItemMap', this.itemIdToItemMap);
	}

	getItemDispVal(itemId: string) {
		let item = this.itemIdToItemMap[itemId];
		return item.name;
	}

	calcOrderTotal(order: Order) {
		return calcOrderTotalUtil(order);
	}

	private extractOrderId(order: Order) : string {
		let selfUrl : string = order._links.self.href;
		let orderId = selfUrl.substring(selfUrl.lastIndexOf('/') + 1);
		console.log("orderId", orderId);
		return orderId;
	}

}
