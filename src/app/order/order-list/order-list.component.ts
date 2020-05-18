import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router'
import { OrderFilter } from '../order-filter';
import { OrderService } from '../order.service';
import { Order, itemCategories, itemNameToItemCatoriesMap } from '../order';

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
	itemCategoriesArray: string[] = itemCategories;
	itemNameToItemCatoriesMap = itemNameToItemCatoriesMap;

	// results
	orderList: Order[] = [];
	ordersSummary: any = {};

	// request related
	filter = new OrderFilter();
	filterForm: FormGroup;

	// display related
	isFilterPanelExpanded: boolean = false;
	columnsToDisplay = ['orderNumber', 'name', 'deliveryDate'];
	expandedElement: Order | null;
	feedback: any = {};

	constructor(
		private orderService: OrderService,
		private fb: FormBuilder,
		private router: Router,
		private spinner: NgxSpinnerService) {
	}

	ngOnInit() {
		this.initFilterForm();
		this.search();
	}

	initFilterForm() {
		this.filterForm = this.createBlankFilterFormGroup();
	}

	private createBlankFilterFormGroup() {
		const formGroup = this.fb.group({
			itemCategory: [''],
			orderNumber: ['', Validators.pattern('[\\d]{1,4}')],
			deliveryStartDate: [''],
			deliveryEndDate: [''],
			name: [''],
			mobile: ['', Validators.pattern('[\\d]{10}$')]
		});
		return formGroup;
	}

	onClear() {
		this.feedback = {};
		this.filterForm = this.createBlankFilterFormGroup();
	}

	onSubmit() {
		this.feedback = {};
		this.closeFilterPanel();
		this.search();
	}

	search(): void {
		this.spinner.show();
		this.convertDatesToMillis(this.filterForm.value);
		this.orderService.load(this.filterForm.value).subscribe(
			result => {
				this.orderList = result;
				this.createSummary();
				this.spinner.hide();
			},
			errResponse => {
				this.orderList = [];
				this.ordersSummary = {};
				this.spinner.hide();
				alert(errResponse.shortErrorMsg);
			}
		);
	}

	onCancel() {
		this.feedback = {};
		this.closeFilterPanel();
	}

	delete(order: Order): void {
		if (confirm('Are you sure?')) {
			this.orderService.delete(order).subscribe(
				() => {
					// this.feedback = { type: 'success', message: 'Delete was successful!' };
					this.search();
				},
				errResponse => {
					// this.feedback = { type: 'warning', message: 'Error deleting order' };
					alert(errResponse.shortErrorMsg);
				}
			);
		}
	}

	edit(order: Order): void {
		this.router.navigate(['/orders', order.id]);
	}

	closeFilterPanel() {
		this.isFilterPanelExpanded = false;
	}

	private convertDatesToMillis(orderFilter: OrderFilter) {
		orderFilter.deliveryStartDateMillis = orderFilter.deliveryStartDate ? Number(orderFilter.deliveryStartDate.valueOf()) : 0;
		orderFilter.deliveryEndDateMillis = orderFilter.deliveryEndDate ? Number(orderFilter.deliveryEndDate.valueOf()) : 0;
	}

	private createSummary() {
		this.ordersSummary = {};
		if (!(this.orderList && this.orderList.length > 0)) {
			return;
		}
		this.orderList.forEach(
			order => {
				order.itemNames.forEach(
					(itemName, index) => {
						// this.updateSummaryForItem(itemName, order.itemCounts[index]);
						let itemCount = order.itemCounts[index];
						let itemCategories: string[] = this.itemNameToItemCatoriesMap[itemName];
						itemCategories.forEach(
							itemCat => {
								if (this.ordersSummary[itemCat]) {
									this.ordersSummary[itemCat] += itemCount;
								} else {
									this.ordersSummary[itemCat] = itemCount;
								}
							}
						)
					}
				);
			}
		);
	}
}
