export class Order {
	orderDate;
	deliveryDate;
	orderType: string;
	orderNumber: number;
	orderStatus: string;
	itemIds: string[];
	orderItems: OrderItem[];
	customer: Customer;
	advance: number;
	notes: string;
	_links: any;
}

export class OrderItem {
	id: string;
	rate: number;
	quantity: number;
}

export class Customer {
	name: string;
	mobile: number;
}

export interface SelectItem {
	id: string;
	name: string;
	groupName: string;
	rate: number;
	type: string;
	comboItemIds: string[];
}

export interface SelectItemGroup {
	disabled?: boolean;
	groupName: string;
	groupItems: SelectItem[];
}

export const itemTypes: string[] = [
	'Coat', 'Shirt', 'Pant', 'Kurta', 'Payjama', 'Jacket', 'Safari Shirt', 'Others'
];

// TODO convert to enum
export const orderStatuses: string[] = [
	'CREATED',
	'READY',
	'DELIVERED',
	'DELIVERED_UNPAID'
];

export const orderTypes: string[] = [
	'COAT',
	'REGULAR'
];
