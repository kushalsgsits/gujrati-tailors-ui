import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User'
import { JwtToken } from '../models/JwtToken'
import { environment } from '../../environments/environment';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	form: FormGroup;
	api = environment.apiUrl + 'login';

	constructor(private auth: AuthService, private http: HttpClient, private router: Router) { }

	ngOnInit() {
		if (this.auth.isLoggedIn()) {
			this.router.navigate(['/orders/new']);
			return;
		}

		this.form = new FormGroup({
			uname: new FormControl('', Validators.required),
			pwd: new FormControl('', Validators.required),
		});
	}

	onSubmit(formValues: User) {
		let url = `${this.api}`;
		this.http.post<JwtToken>(url, formValues).subscribe(
			jwtToken => {
				this.auth.setToken(jwtToken.token);
				this.router.navigate(['/orders/new']);
			},
			errResponse => {
				alert(errResponse.shortErrorMsg);
			}
		);
	}
}