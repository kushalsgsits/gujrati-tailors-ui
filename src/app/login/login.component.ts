import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationRequest } from '../models/AuthenticationRequest'
import { AuthenticationResponse } from '../models/AuthenticationResponse'
import { environment } from '../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	form: FormGroup;
	api = environment.apiUrl + 'authenticate';

	constructor(private auth: AuthService,
		private http: HttpClient,
		private router: Router,
		private spinner: NgxSpinnerService) { }

	ngOnInit() {
		if (this.auth.isLoggedIn()) {
			this.router.navigate(['/orders/new']);
			return;
		}

		this.form = new FormGroup({
			username: new FormControl('', Validators.required),
			password: new FormControl('', Validators.required),
		});
	}

	onSubmit(authPayload: AuthenticationRequest) {
		this.spinner.show();
		let url = `${this.api}`;
		this.http.post<AuthenticationResponse>(url, authPayload).subscribe(
			authResponse => {
				this.auth.setToken(authResponse.jwtToken);
				this.router.navigate(['/orders/new']);
				this.spinner.hide();
			},
			errResponse => {
				this.spinner.hide();
				alert(errResponse.shortErrorMsg);
			}
		);
	}
}