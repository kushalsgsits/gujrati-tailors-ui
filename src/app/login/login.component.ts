import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ApiService } from '../api/api.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/User'
import { JwtToken } from '../models/JwtToken'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	form: FormGroup;

	constructor(private auth: AuthService, private api: ApiService, private router: Router) { }

	ngOnInit() {
		this.form = new FormGroup({
			uname: new FormControl('', Validators.required),
			pwd: new FormControl('', Validators.required),
		});
	}

	onSubmit(formValues: User) {
		console.log("Login form values: {" + formValues.uname + ", " + formValues.pwd + "}");
		/*const payload = {
			uname: formValues.uname,
			pwd: formValues.pwd
		}*/
		const a = this.api.post<JwtToken>('login', formValues)/*.pipe(
			map(res => {
				console.log("res: " + res);
				this.auth.setToken("token");
			}),
			catchError(this.handleError))*/
			.subscribe(jwtToken => {
				console.log("JWT: " + jwtToken.token);
				this.auth.setToken(jwtToken.token);
				this.router.navigate(['/dashboard']);
			});
		console.log("a: " + a);
	}


	private handleError(error: HttpErrorResponse) {
		console.log("Login error: " + error.message);
		return throwError('A login error occurred: ' + error.message);
	}
}