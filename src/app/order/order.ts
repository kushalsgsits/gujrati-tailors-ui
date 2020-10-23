export class Order {
	id: number;
	orderDate;
	orderDateMillis: number;
	deliveryDate;
	deliveryDateMillis: number;
	orderType: string;
	orderNumber: number;
	orderStatus: string;
	name: string;
	mobile: number;
	itemIds: string[];
	itemCounts: number[];
	itemRates: number[];
	notes: string;
}

export interface SelectItem {
	dispVal: string;
	groupId: string;
	id: string;
	rate: number;
	type: string;
	comboItemIds: string[];
}

export interface SelectItemGroup {
	disabled?: boolean;
	groupName: string;
	groupItems: SelectItem[];
}

export const itemCategories: string[] = [
	'Coat', 'Shirt', 'Pant', 'Kurta', 'Payjama', 'Jacket', 'Safari Shirt', 'Others'
];

export const orderStatuses: string[] = [
	'Created',
	'Ready',
	'Delivered',
	'Delivered (Unpaid)'
];
