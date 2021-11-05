import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class ItemService {

	constructor(private http: HttpClient) {
	}

	getGroupedItemsWithRate(): Observable<any> {
		const api = environment.apiUrl + 'items/groupedItems';
		return this.http.get<any>(api);
	}

	save(rates): Observable<any> {
		let params = new HttpParams();
		const api = environment.apiUrl + 'rates';
		return this.http.post<any>(api, rates, { params });
	}
}

