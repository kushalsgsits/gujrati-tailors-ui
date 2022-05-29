import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';

import { MatSelectChange } from '@angular/material/select';

import { OrderService } from '../order.service';
import { ItemService } from '../../item/item.service';
import { PrintService } from '../../print/print.service';
import { Order, OrderItem, SelectItemGroup } from '../order';
import { getSelectItem, removeSafariShirt, calcOrderTotalUtil } from './../../utils';

import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxSpinnerService } from "ngx-spinner";

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

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
	selector: 'app-order-edit',
	templateUrl: './order-edit.component.html',
	styleUrls: ['./order-edit.component.css'],
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
})
export class OrderEditComponent implements OnInit, OnDestroy {

	groupedItemsWithRate: SelectItemGroup[];
	orderForm: FormGroup;
	selectedItemsOld: string[];
	mySubscription: any;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private orderService: OrderService,
		private itemService: ItemService,
		private fb: FormBuilder,
		private spinner: NgxSpinnerService,
		private printService: PrintService) {

		this.router.routeReuseStrategy.shouldReuseRoute = function() {
			return false;
		};
		this.mySubscription = this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				// Trick the Router into believing it's last link wasn't previously loaded
				this.router.navigated = false;
			}
		});
	}

	ngOnInit() {
		this.initOrder();
	}


	ngOnDestroy() {
		if (this.mySubscription) {
			this.mySubscription.unsubscribe();
		}
	}

	private initOrder() {
	  // TODO fix spinner in inOnInit
		this.spinner.show();
		this.route.params
			.pipe(
				map(p => p.id),
				switchMap(id => {
					if (id === 'new') {
						const emptyOrder = new Order();
						emptyOrder.orderDate = moment();
						emptyOrder.itemIds = [];
						emptyOrder.orderItems = [];
						return of(emptyOrder);
					}
					return this.orderService.findById(id);
				})
			)
			.subscribe(
				order => {
					this.itemService.getGroupedItemsWithRate().subscribe(
						groupedItemsWithRate => {
							this.groupedItemsWithRate = groupedItemsWithRate;
							// Remove Safari shrt from items list as it is not to be shown in UI
							this.removeSafariShirtFromItems();
							// Disable Coat group
							this.groupedItemsWithRate[0].disabled = true;
							console.log('GroupedItemsWithRate', this.groupedItemsWithRate);
							this.selectedItemsOld = [];
							order.orderItems.forEach(x => this.selectedItemsOld.push(x.id));
							order.itemIds = this.selectedItemsOld;
							this.initOrderForm(order);
							this.spinner.hide();
						},
						errRes => {
							this.spinner.hide();
							alert(errRes.errorMessage);
							// TODO handle error in getGroupedItemsWithRate
						}
					);
				},
				errResponse => {
					this.spinner.hide();
					alert(errResponse.errorMessage);
          this.router.navigate(['/orders/new']);
				}
			);
	}

	private initOrderForm(order: Order) {
		this.orderForm = this.fb.group({
			orderType: [order.orderType, Validators.required],
			orderDate: [order.orderDate, Validators.required],
			deliveryDate: [order.deliveryDate, Validators.required],
			orderNumber: [order.orderNumber, [Validators.required, Validators.pattern('[\\d]{1,4}$')]],
      customer: this.fb.group({
				name: [order.customer ? order.customer.name : '', Validators.required],
				mobile: [order.customer ? order.customer.mobile : '', [Validators.required, Validators.pattern('[\\d]{10}$')]],
			}),
      itemIds: [order.itemIds, Validators.required],
			orderItems: this.fb.array(this.getOrdetItemsFormGroupArrayFromOrderItems(order.orderItems)),
			notes: [order.notes, Validators.maxLength(300)],
			// These are not linked to any UI input control
			orderStatus: [order.orderStatus],
			_links: [order._links]
		});
		this.updateCoatGroup(order.orderType);
		if (this.isEditing) {
			this.orderForm.get('orderType').disable();
			this.orderForm.get('orderNumber').disable();
			this.orderForm.get('orderDate').disable();
		}
		console.log('Initialized Order form: ', this.orderForm.getRawValue());
	}

	getOrdetItemsFormGroupArrayFromOrderItems(orderItems: OrderItem[]): FormGroup[] {
		const arr: FormGroup[] = [];
		if (null == orderItems || orderItems.length == 0) {
			return arr;
		}
		orderItems.forEach(x => arr.push(this.getOrdetItemsFormGroupFromOrderItem(x)));
		return arr;
	}

	getOrdetItemsFormGroupFromOrderItem(orderItem: OrderItem): FormGroup {
		return this.fb.group({
			id: [orderItem.id, Validators.required],
			quantity: [orderItem.quantity, [Validators.required, Validators.pattern('[1-9][0-9]{0,2}')]],
			rate: [orderItem.rate, [Validators.required, Validators.pattern('[1-9][0-9]{0,3}')]]
		})
	}

	get orderItems(): FormArray {
		return this.orderForm.get('orderItems') as FormArray;
	}

	onItemSelectionChange(event: MatSelectChange) {
		const itemIds: string[] = event.value;
		if (itemIds.length > this.selectedItemsOld.length) {
			let addedItemId = itemIds.filter(x => !this.selectedItemsOld.includes(x))[0];
			let idx = itemIds.indexOf(addedItemId);
			let orderItem = new OrderItem();
			orderItem.id = addedItemId;
			orderItem.quantity = 1;
			orderItem.rate = getSelectItem(addedItemId, this.groupedItemsWithRate).rate;
			let orderItemFormGroup = this.getOrdetItemsFormGroupFromOrderItem(orderItem);
			this.orderItems.insert(idx, orderItemFormGroup);
		} else {
			let difference = this.selectedItemsOld.filter(x => !itemIds.includes(x));
			let idx = this.selectedItemsOld.indexOf(difference[0]);
			this.orderItems.removeAt(idx);
		}
		this.selectedItemsOld = itemIds;
	}

	onOrderTypeChange(event: MatSelectChange) {
		const orderType: string = event.value;
		this.updateCoatGroup(orderType);
	}

	onSubmit() {
		this.save();
	}

	private updateCoatGroup(orderType: string) {
		let isOrderTypeRegular = null == orderType || 'REGULAR' === orderType;
		// Disable Coat group if Order Type is "REGULAR"
		this.groupedItemsWithRate[0].disabled = isOrderTypeRegular;
	}

	private save() {
		this.spinner.show();
		let orderToBeSaved : Order = this.orderForm.getRawValue();
		console.log('Saving Order', orderToBeSaved);
		this.orderService.save(orderToBeSaved).subscribe(
			order => {
				console.log('Order saved successfully', order);
				alert('Order saved successfully');
        this.spinner.hide();
        this.router.navigate(['/orders/new']).then(value => {
          this.printService.printDocument('invoice', order._links.self.href);
        })
			},
			errResponse => {
				this.spinner.hide();
				alert(errResponse.errorMessage);
			}
		);
	}

	onCancel() {
		this.router.navigate(['/orders']);
	}

	get isEditing(): boolean {
		return this.orderForm != null && this.orderForm.get('_links').value != null;
	}

	private removeSafariShirtFromItems() {
		removeSafariShirt(this.groupedItemsWithRate);
	}

	getItemDispValue(itemId: string) : string {
		let item = getSelectItem(itemId, this.groupedItemsWithRate);
		return item.name;
	}

	calcOrderTotal(order: Order) {
		return calcOrderTotalUtil(order);
	}
}
