export class Order {
	id: number;
	orderDate;
	orderDateMillis: number;
	deliveryDate;
	deliveryDateMillis: number;
	orderType: string;
	orderNumber: number;
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
			{ value: 'Jeans', viewValue: 'Jeans' }
		]
	},
	{
		name: 'Kurta-Payjama',
		selectItems: [
			{ value: 'Kurta', viewValue: 'Kurta' },
			{ value: 'Payjama', viewValue: 'Payjama' },
			{ value: 'Pant-Payjama', viewValue: 'Pant-Payjama' },
			{ value: 'Pathani', viewValue: 'Pathani' },
			{ value: 'Kurti', viewValue: 'Kurti' }
		]
	},
	{
		name: 'Miscellanious',
		selectItems: [
			{ value: 'Jacket', viewValue: 'Jacket' },
			{ value: 'Safari', viewValue: 'Safari' },
			{ value: 'Others', viewValue: 'Others' },
		]
	}
];

export const itemCategories: string[] = [
	'Coat', 'Shirt', 'Pant', 'Kurta', 'Payjama', 'Jacket', 'Safari'
];
