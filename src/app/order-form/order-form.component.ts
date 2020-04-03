import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-order-form',
	templateUrl: './order-form.component.html',
	styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

	form: FormGroup;

	constructor() { }

	ngOnInit() {
		this.form = new FormGroup({
			name: new FormControl('', Validators.required),
			mobileNum: new FormControl('', Validators.pattern('[\\d]+')),
			description: new FormControl('', Validators.required),
		});
	}

	onSubmit(order) {
		console.log(order);
	}
}