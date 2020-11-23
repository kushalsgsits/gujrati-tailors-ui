import { environment } from '../../environments/environment';
import { ItemFilter } from './item-filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class ItemService {

	constructor(private http: HttpClient) {
	}

	getGroupedItemsWithRate(filter: ItemFilter): Observable<any> {
		const params = {
			'dateMillis': filter.dateMillis
		};
		const api = environment.apiUrl + 'grouped-items';
		return this.http.get<any>(api, { params });
	}

	save(rates): Observable<any> {
		let params = new HttpParams();
		const api = environment.apiUrl + 'rates';
		return this.http.post<any>(api, rates, { params });
	}
}

