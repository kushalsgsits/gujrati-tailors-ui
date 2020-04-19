import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
	providedIn: 'root'
})
export class ApiService {

	apiUrl: string = environment.apiUrl;

	constructor(private http: HttpClient, private auth: AuthService) { }

	post<T>(url: string, payload) {
		const reqHeaders = new HttpHeaders();
		reqHeaders.set('Authorization', 'Bearer ' + this.auth.getToken());
		console.log('POST request; url=' + url + ', payload=' + payload + ', reqHeaders=' + reqHeaders.get('Authorization'));
		return this.http.post<T>(this.apiUrl + url, payload, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.auth.getToken())});
	}

}
