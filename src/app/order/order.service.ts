import { environment } from '../../environments/environment';
import { Order } from './order';
import { OrderFilter } from './order-filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const headers = new HttpHeaders().set('Accept', 'application/json');

@Injectable()
export class OrderService {
	orderList: Order[] = [];
	api = environment.apiUrl + 'orders';

	constructor(private http: HttpClient) {
	}

	findById(id: string): Observable<Order> {
		const url = `${this.api}/${id}`;
		// const params = { id: id };
		const params = {};
		return this.http.get<Order>(url, { params, headers });
	}

	load(filter: OrderFilter): void {
		this.find(filter).subscribe(result => {
			this.orderList = result;
		},
			err => {
				console.error('error loading', err);
			}
		);
	}

	find(filter: OrderFilter): Observable<Order[]> {
		const params = {
			'orderType': filter.orderType,
			'orderNumber': filter.orderNumber,
			'name': filter.name,
			'mobile': filter.mobile,
		};

		return this.http.get<Order[]>(this.api, { params, headers });
	}

	save(entity: Order): Observable<Order> {
		let params = new HttpParams();
		let url = '';
		if (entity.id) {
			url = `${this.api}/${entity.id.toString()}`;
			params = new HttpParams().set('ID', entity.id.toString());
			return this.http.put<Order>(url, entity, { headers, params });
		} else {
			url = `${this.api}`;
			return this.http.post<Order>(url, entity, { headers, params });
		}
	}

	delete(entity: Order): Observable<Order> {
		let params = new HttpParams();
		let url = '';
		if (entity.id) {
			url = `${this.api}/${entity.id.toString()}`;
			// params = new HttpParams().set('ID', entity.id.toString());
			return this.http.delete<Order>(url, { headers, params });
		}
		return null;
	}
}

