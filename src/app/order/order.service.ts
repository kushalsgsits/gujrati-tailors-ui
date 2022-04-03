import {environment} from '../../environments/environment';
import {Order} from './order';
import {OrderFilter} from './order-filter';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class OrderService {
	api = environment.apiUrl + 'orders';

	constructor(private http: HttpClient) {
	}

	findById(id: string): Observable<Order> {
		const url = `${this.api}/${id}`;
		return this.http.get<Order>(url);
	}

	load(filter: OrderFilter): Observable<any> {
		return this.find(filter);
	}

	find(filter: OrderFilter): Observable<any> {
    const params = {
      'deliveryDateStart': filter.deliveryDateStart ? filter.deliveryDateStart.toISOString() : "",
      'deliveryDateEnd': filter.deliveryDateEnd ? filter.deliveryDateEnd.toISOString() : "",
      'orderType': filter.orderType,
      'orderNumber': filter.orderNumber,
      'orderStatus': `${filter.orderStatus}`,
      'mobile': filter.mobile
    };
    let url = this.api + '/customSearch';
		return this.http.get<any>(url, { params });
	}

	save(order: Order): Observable<Order> {
		let url = '';
		if (order._links) {
			url = `${order._links.self.href}`;
			return this.http.put<Order>(url, order);
		} else {
			url = `${this.api}`;
			return this.http.post<Order>(url, order);
		}
	}

	delete(order: Order): Observable<Order> {
		let url = `${order._links.self.href}`;
		return this.http.delete<Order>(url);
	}
}

