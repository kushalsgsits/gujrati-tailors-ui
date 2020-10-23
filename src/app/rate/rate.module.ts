import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxSpinnerModule } from "ngx-spinner";

import { MatFormFieldModule } from '@angular/material/form-field';

import { RateEditComponent } from './rate-edit/rate-edit.component';



@NgModule({
	declarations: [RateEditComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxSpinnerModule,
		MatFormFieldModule
	]
})
export class RateModule { }
