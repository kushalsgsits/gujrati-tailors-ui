import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';

import { MatSelectChange } from '@angular/material/select';

import { OrderService } from '../order.service';
import { ItemService } from '../../item/item.service';
import { Order, SelectItemGroup } from '../order';
import { getItemDispVal, getItemRate, removeSafariShirt } from './../../utils';

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
	feedback: any = {};
	selectedItemsOld: string[];
	mySubscription: any;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private orderService: OrderService,
		private itemService: ItemService,
		private fb: FormBuilder,
		private spinner: NgxSpinnerService) {

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
		this.spinner.show();
		this.route.params
			.pipe(
				map(p => p.id),
				switchMap(id => {
					if (id === 'new') {
						const emptyOrder = new Order();
						emptyOrder.orderDate = moment();
						emptyOrder.itemIds = [];
						return of(emptyOrder);
					}
					return this.orderService.findById(id);
				})
			)
			.subscribe(
				order => {
					// For creating new order, pass dateMillis=0 to get latest rates
					// For editing an order, pass dateMillis as per orderDate of that order
					let dateMillis = this.isEditing ? order.orderDateMillis : 0;
					this.itemService.getGroupedItemsWithRate({ dateMillis: dateMillis }).subscribe(
						groupedItemsWithRate => {
							this.groupedItemsWithRate = groupedItemsWithRate;
							// Remove Safari shrt from items list as it is not to be shown in UI
							this.removeSafariShirtFromItems();
							// Disable Coat group
							this.groupedItemsWithRate[0].disabled = true;
							console.log('GroupedItemsWithRate', this.groupedItemsWithRate);
							this.selectedItemsOld = order.itemIds;
							this.feedback = {};
							this.initOrderForm(order);
							this.spinner.hide();
						},
						errRes => {
							this.spinner.hide();
							alert(errRes.shortErrorMsg);
						}
					);
				},
				errResponse => {
					this.spinner.hide();
					// this.feedback = { type: 'warning', message: 'Error loading order details. Please check internet connection or contact Kushal' };
					alert(errResponse.shortErrorMsg);
				}
			);
	}

	private initOrderForm(order: Order) {
		this.convertMillisToDate(order);
		this.orderForm = this.fb.group({
			id: [order.id],
			orderStatus: [order.orderStatus],
			orderType: [order.orderType, Validators.required],
			orderDate: [order.orderDate, Validators.required],
			deliveryDate: [order.deliveryDate, Validators.required],
			orderNumber: [order.orderNumber, [Validators.required, Validators.pattern('[\\d]{1,4}$')]],
			name: [order.name, Validators.required],
			mobile: [order.mobile, [Validators.required, Validators.pattern('[\\d]{10}$')]],
			itemIds: [order.itemIds, Validators.required],
			itemCounts: this.fb.array(this.getItemFormArrayFromItemCounts(order.itemCounts)),
			itemRates: this.fb.array(this.getItemRateFormArrayFromItemRates(order.itemRates)),
			notes: [order.notes, Validators.maxLength(300)]
		});
		this.updateCoatGroup(order.orderType);
		console.log('Initialized Order form: ', this.orderForm.value);
	}

	getItemFormArrayFromItemCounts(itemCounts: number[]): FormControl[] {
		const arr: FormControl[] = [];
		if (null == itemCounts || itemCounts.length == 0) {
			return arr;
		}
		itemCounts.forEach(x => arr.push(this.fb.control(x, [Validators.required, Validators.pattern('[1-9][0-9]{0,2}')])));
		return arr;
	}

	getItemRateFormArrayFromItemRates(itemRates: number[]): FormControl[] {
		const arr: FormControl[] = [];
		if (null == itemRates || itemRates.length == 0) {
			return arr;
		}
		itemRates.forEach(rate => arr.push(this.fb.control(rate, [Validators.required, Validators.pattern('[1-9][0-9]{0,3}')])));
		return arr;
	}

	get itemCounts(): FormArray {
		return this.orderForm.get('itemCounts') as FormArray;
	}

	get itemRates(): FormArray {
		return this.orderForm.get('itemRates') as FormArray;
	}

	onItemSelectionChange(event: MatSelectChange) {
		const items: string[] = event.value;
		if (items.length > this.selectedItemsOld.length) {
			let addedItemId = items.filter(x => !this.selectedItemsOld.includes(x))[0];
			let idx = items.indexOf(addedItemId);
			this.itemCounts.insert(idx, this.fb.control('', [Validators.required, Validators.pattern('[1-9][0-9]{0,2}')]));
			let currItemRate = getItemRate(addedItemId, this.groupedItemsWithRate);
			this.itemRates.insert(idx, this.fb.control(currItemRate, [Validators.required, Validators.pattern('[1-9][0-9]{0,3}')]));
		} else {
			let difference = this.selectedItemsOld.filter(x => !items.includes(x));
			let idx = this.selectedItemsOld.indexOf(difference[0]);
			this.itemCounts.removeAt(idx);
			this.itemRates.removeAt(idx);
		}
		this.selectedItemsOld = items;
	}

	onOrderTypeChange(event: MatSelectChange) {
		const orderType: string = event.value;
		this.updateCoatGroup(orderType);
	}

	onSubmit() {
		this.save();
	}

	private updateCoatGroup(orderType: string) {
		let isOrderTypeRegular = null == orderType || 'Regular' === orderType;
		// Disable Coat group if Order Type is "Regular"
		this.groupedItemsWithRate[0].disabled = isOrderTypeRegular;
	}

	private save() {
		this.spinner.show();
		this.convertDatesToMillis(this.orderForm.value);
		this.orderService.save(this.orderForm.value).subscribe(
			order => {
				// TODO kc reload /orders/new
				this.router.navigate(['/orders/new']);
				this.spinner.hide();
				alert('Order save successfully');
			},
			errResponse => {
				// this.feedback = { type: 'warning', message: 'Error saving order' };
				this.spinner.hide();
				alert(errResponse.shortErrorMsg);
			}
		);
	}

	onCancel() {
		this.router.navigate(['/orders']);
	}

	get isEditing(): boolean {
		return this.orderForm != null && this.orderForm.get('id').value != null;
	}

	private convertDatesToMillis(order: Order) {
		console.log('Before convertDatesToMillis: ', this.orderForm.value);
		order.orderDateMillis = Number(order.orderDate.valueOf());
		order.deliveryDateMillis = Number(order.deliveryDate.valueOf());
		if (order.orderDateMillis > order.deliveryDateMillis) {
			order.deliveryDateMillis = order.orderDateMillis;
		}
		console.log('After convertDatesToMillis: ', this.orderForm.value);
	}

	private convertMillisToDate(order: Order) {
		console.log('Before convertMillisToDate: ', order);
		if (order.deliveryDateMillis) {
			order.deliveryDate = moment(order.deliveryDateMillis);
		}
		if (order.orderDateMillis) {
			order.orderDate = moment(order.orderDateMillis);
		}
		console.log('After convertMillisToDate: ', order);
	}

	private removeSafariShirtFromItems() {
		removeSafariShirt(this.groupedItemsWithRate);
	}

	getItemDispValue(itemId: string) {
		return getItemDispVal(itemId, this.groupedItemsWithRate);
	}
}
