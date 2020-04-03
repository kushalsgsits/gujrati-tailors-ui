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
		const list = [new Order("Jay", 9876543210, "description1"), new Order("Viru", 9876543211, "description2")];
		callback(list);
	}
}
