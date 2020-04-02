import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor() { }

	saveOrder(order: Order, callback) {
		console.log("Order saved: ");
		console.log(order);
		callback(true);
	}

	getAllOrders(callback) {
		const list = [new Order("Jay", 500), new Order("Viru", 1500)];
		callback(list);
	}
}
