import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { removeSafariShirt } from './../../utils';
import { SelectItemGroup, SelectItem } from '../../order/order';
import { ItemService } from '../../item/item.service';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
	selector: 'app-rate-edit',
	templateUrl: './rate-edit.component.html'
})
export class RateEditComponent implements OnInit {

	groupedItemsWithRate: SelectItemGroup[];
	rateForm: FormGroup;

	constructor(
		private itemService: ItemService,
		private spinner: NgxSpinnerService,
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		private router: Router) {
	}

	ngOnInit(): void {
		this.loadRates();
	}

	onSubmit() {
		this.save();
	}

	onCancel() {
		this.router.navigate(['/orders/new']);
	}

	private save() {
		this.spinner.show();
		const rates = this.buildRatesPayload();
		this.itemService.save(rates).subscribe(
			() => {
				// Re-fetch so the (single-entry, freshness) service-worker cache for
				// groupedItems is refreshed with the new rates instead of serving stale ones.
				this.refreshRatesAfterSave();
			},
			errResponse => {
				this.spinner.hide();
				this.snackBar.open(errResponse.errorMessage || 'Failed to update rates', 'Dismiss', { duration: 5000 });
			}
		);
	}

	private buildRatesPayload(): { rates: { [itemId: string]: number } } {
		const rates: { [itemId: string]: number } = {};
		this.groupedItemsWithRate.forEach(group => {
			const items = this.rateForm.get(group.groupName) as FormArray;
			items.getRawValue().forEach((row: { id: string, rate: number }) => {
				rates[row.id] = row.rate;
			});
		});
		return { rates };
	}

	private refreshRatesAfterSave() {
		// Bypass SW cache — freshness timeout 0s otherwise returns pre-save groupedItems.
		this.itemService.getGroupedItemsWithRate(true).subscribe(
			groupedItemsWithRate => {
				this.groupedItemsWithRate = groupedItemsWithRate;
				this.removeSafariShirtFromItems();
				this.initRateForm();
				this.spinner.hide();
				this.snackBar.open('Rates updated successfully', 'OK', { duration: 3000 });
			},
			errRes => {
				this.spinner.hide();
				// The save succeeded; only the refresh failed.
				this.snackBar.open('Rates updated. Refresh failed: ' + (errRes.errorMessage || ''), 'OK', { duration: 4000 });
			}
		);
	}

	private loadRates() {
		this.spinner.show();
		this.itemService.getGroupedItemsWithRate().subscribe(
			groupedItemsWithRate => {
				this.groupedItemsWithRate = groupedItemsWithRate;
				// Safari shirt is hidden across the app; it is not editable here.
				this.removeSafariShirtFromItems();
				this.initRateForm();
				this.spinner.hide();
			},
			errRes => {
				this.spinner.hide();
				this.snackBar.open(errRes.errorMessage || 'Failed to load rates', 'Dismiss', { duration: 5000 });
			}
		);
	}

	private initRateForm() {
		this.rateForm = this.fb.group({});
		this.groupedItemsWithRate.forEach(
			group => this.rateForm.addControl(
				group.groupName,
				this.fb.array(group.groupItems.map(item => this.createItemRateFormGroup(item)))
			)
		);
	}

	private createItemRateFormGroup(item: SelectItem): FormGroup {
		return this.fb.group({
			id: [item.id],
			name: [{ value: item.name, disabled: true }],
			rate: [item.rate, [Validators.required, Validators.pattern('[\\d]{1,4}')]]
		});
	}

	private removeSafariShirtFromItems() {
		removeSafariShirt(this.groupedItemsWithRate);
	}

	get groupFormArrayNames(): string[] {
		return Object.keys(this.rateForm.controls);
	}

	getGroupFormArrayControls(groupName: string): FormArray {
		return this.rateForm.get(groupName) as FormArray;
	}

}
