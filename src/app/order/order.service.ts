import { environment } from '../../environments/environment';
import { Order } from './order';
import { OrderFilter } from './order-filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class OrderService {
	api = environment.apiUrl + 'orders';

	constructor(private http: HttpClient) {
	}

	findById(id: string): Observable<Order> {
		const url = `${this.api}/${id}`;
		return this.http.get<Order>(url);
	}

	load(filter: OrderFilter): Observable<Order[]> {
		return this.find(filter);
	}

	find(filter: OrderFilter): Observable<Order[]> {
		const params = {
			'orderStatus': `${filter.orderStatus}`,
			'itemCategory': `${filter.itemCategory}`,
			'orderNumber': filter.orderNumber,
			'deliveryStartDateMillis': filter.deliveryStartDateMillis,
			'deliveryEndDateMillis': filter.deliveryEndDateMillis,
			'mobile': filter.mobile,
			'name': filter.name
		};
		return this.http.get<Order[]>(this.api, { params });
	}

	save(order: Order): Observable<Order> {
		let params = new HttpParams();
		let url = '';
		if (order.id) {
			url = `${this.api}/${order.id.toString()}`;
			params = new HttpParams().set('ID', order.id.toString());
			return this.http.put<Order>(url, order, { params });
		} else {
			url = `${this.api}`;
			return this.http.post<Order>(url, order, { params });
		}
	}

	delete(entity: Order): Observable<Order> {
		let url = `${this.api}/${entity.id.toString()}`;
		return this.http.delete<Order>(url);
	}
}

