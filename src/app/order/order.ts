export class Order {
	id: number;
	orderDate: string;
	deliveryDate: string;
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
			{ value: 'Shirt-Pant', viewValue: 'Shirt-Pant' },
			{ value: 'Shirt', viewValue: 'Shirt' },
			{ value: 'Pant', viewValue: 'Pant' }
		]
	},
	{
		name: 'Kurta-Payjama',
		selectItems: [
			{ value: 'Kurta-Payjama', viewValue: 'Kurta-Payjama' },
			{ value: 'Kurta', viewValue: 'Kurta' },
			{ value: 'Payjama', viewValue: 'Payjama' },
			{ value: 'Pant-Payjama', viewValue: 'Pant-Payjama' },
			{ value: 'Pathani', viewValue: 'Pathani' }
		]
	},
	{
		name: 'Miscellanious',
		selectItems: [
			{ value: 'Nehru-Jacket', viewValue: 'Nehru-Jacket' },
			{ value: 'Others', viewValue: 'Others' },
		]
	}
];
