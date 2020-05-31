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
	itemNames: string[];
	itemCounts: number[];
	notes: string;
}

export interface SelectItem {
	value: string;
	viewValue: string;
}

export interface SelectItemGroup {
	disabled?: boolean;
	name: string;
	selectItems: SelectItem[];
}

export const selectItemGroups: SelectItemGroup[] = [
	{
		name: 'Coat',
		disabled: true,
		selectItems: [
			{ value: '2PS', viewValue: '2 Piece Suit' },
			{ value: '3PS', viewValue: '3 Piece Suit' },
			{ value: 'Blazer', viewValue: 'Blazer' },
			{ value: 'Achkan', viewValue: 'Achkan' }
		]
	},
	{
		name: 'Shirt-Pant',
		selectItems: [
			{ value: 'Shirt', viewValue: 'Shirt' },
			{ value: 'Pant', viewValue: 'Pant' },
			{ value: 'Jeans', viewValue: 'Jeans' },
			{ value: 'Kurti', viewValue: 'Kurti' }
		]
	},
	{
		name: 'Kurta-Payjama',
		selectItems: [
			{ value: 'Kurta', viewValue: 'Kurta' },
			{ value: 'Payjama', viewValue: 'Payjama' },
			{ value: 'Pant Payjama', viewValue: 'Pant Payjama' },
			{ value: 'Pathani', viewValue: 'Pathani' }
		]
	},
	{
		name: 'Miscellanious',
		selectItems: [
			{ value: 'Jacket', viewValue: 'Jacket' },
			{ value: 'Waist Coat', viewValue: 'Waist Coat' },
			{ value: 'Safari', viewValue: 'Safari' },
			{ value: 'Others', viewValue: 'Others' },
		]
	}
];

export const itemCategories: string[] = [
	'Coat', 'Shirt', 'Pant', 'Kurta', 'Payjama', 'Jacket', 'Safari Shirt', 'Others'
];

export const itemNameToItemCatoriesMap = {
	'2 Piece Suit': ['Coat', 'Pant'],
	'3 Piece Suit': ['Coat', 'Pant', 'Jacket'],
	'Blazer': ['Coat'],
	'Achkan': ['Coat'],
	'Shirt': ['Shirt'],
	'Pant': ['Pant'],
	'Jeans': ['Pant'],
	'Kurti': ['Shirt'],
	'Kurta': ['Kurta'],
	'Payjama': ['Payjama'],
	'Pant Payjama': ['Pant'],
	'Pathani': ['Kurta'],
	'Jacket': ['Jacket'],
	'Waist Coat': ['Jacket'],
	'Safari': ['Safari Shirt', 'Pant'],
	'Others': ['Others']
}

export const orderStatuses: string[] = [
	'Created',
	'In Progress',
	'Ready',
	'Delivered',
	'Delivered (Unpaid)'
];
