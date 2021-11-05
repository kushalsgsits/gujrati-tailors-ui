import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { getSelectItem, removeSafariShirt } from './../../utils';
import { SelectItemGroup, SelectItem } from '../../order/order';
import { ItemService } from '../../item/item.service';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
	selector: 'app-rate-edit',
	templateUrl: './rate-edit.component.html',
	styleUrls: ['./rate-edit.component.css']
})
export class RateEditComponent implements OnInit {

	groupedItemsWithRate: SelectItemGroup[];
	rateForm: FormGroup;

	constructor(
		private itemService: ItemService,
		private spinner: NgxSpinnerService,
		private fb: FormBuilder,
		private router: Router) {
	}

	ngOnInit(): void {
		this.init();
	}

	onSubmit() {
		this.save();
	}

	onCancel() {
		this.router.navigate(['/orders/new']);
	}

	private save() {
		console.log("RateFormValue", this.rateForm.value)
		this.spinner.show();
		const itemIds: string[] = [];
		const itemRates: number[] = [];
		const rates = { itemIds: itemIds, itemRates: itemRates };
		this.groupedItemsWithRate.forEach(
			group => {
				let rates: number[] = this.rateForm.value[group.groupName]
				group.groupItems.forEach(
					(item, idx) => {
						itemIds.push(item.id);
						itemRates.push(rates[idx]);
					}
				)
			}
		)
		console.log("Rates to be updates", rates)
		this.itemService.save(rates).subscribe(
			res => {
				this.router.navigate(['/orders/new']);
				this.spinner.hide();
				alert('Rates updated successfully');
			},
			errResponse => {
				this.spinner.hide();
				alert(errResponse.shortErrorMsg);
			}
		);
	}

	private init() {
		this.spinner.show();
		this.itemService.getGroupedItemsWithRate().subscribe(
			groupedItemsWithRate => {
				this.groupedItemsWithRate = groupedItemsWithRate;
				// Remove Safari shrt from items list as it is not to be shown in UI
				this.removeSafariShirtFromItems();
				this.initRateForm();
				this.spinner.hide();
			},
			errRes => {
				this.spinner.hide();
				alert(errRes.shortErrorMsg);
			}
		);
	}

	private initRateForm() {
		this.rateForm = this.fb.group({});
		this.groupedItemsWithRate.forEach(
			group => this.rateForm.addControl(group.groupName, this.fb.array(this.createFormArrayFromGroupedItems(group.groupItems)))
		)
	}

	private createFormArrayFromGroupedItems(items: SelectItem[]): FormControl[] {
		const arr: FormControl[] = [];
		if (null == items || items.length == 0) {
			return arr;
		}
		items.forEach(item => arr.push(this.fb.control(item.rate, [Validators.required, Validators.pattern('[\\d]{1,4}')])));
		return arr;
	}

	private removeSafariShirtFromItems() {
		removeSafariShirt(this.groupedItemsWithRate);
	}

	getItemDispValue(itemId: string) : string {
		return getSelectItem(itemId, this.groupedItemsWithRate).name;
	}

	get groupFormArrayNames(): string[] {
		return Object.keys(this.rateForm.controls);
	}

	getGroupFormArrayControls(groupName: string): FormArray {
		return this.rateForm.get(groupName) as FormArray;
	}

}
