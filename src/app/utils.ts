import { SelectItemGroup } from './order/order';

export function getItemDispVal(itemId: string, groupedItemsWithRate: SelectItemGroup[]) {
	let result: string = '';
	groupedItemsWithRate.forEach(
		group => {
			if (result !== '') {
				return;
			}
			group.groupItems.forEach(
				item => {
					if (item.id === itemId) {
						result = item.dispVal;
						return;
					}
				}
			)
		}
	)
	return result;
}

export function getItemRate(itemId: string, groupedItemsWithRate: SelectItemGroup[]) {
	let result: number = -1;
	groupedItemsWithRate.forEach(
		group => {
			if (result !== -1) {
				return;
			}
			group.groupItems.forEach(
				item => {
					if (item.id === itemId) {
						result = item.rate;
						return;
					}
				}
			)
		}
	)
	return result;
}

export function removeSafariShirt(groupedItemsWithRate: SelectItemGroup[]) {
	let indexFound = -1;
	groupedItemsWithRate.forEach(
		group => {
			if (indexFound !== - 1) {
				return;
			}
			console.log('group.groupItems=' + group.groupItems);
			group.groupItems.forEach(
				(item, index) => {
					if (item.id === 'safariShirt') {
						indexFound = index;
						console.log('indexFount=' + indexFound);
					}
				}
			)
			if (indexFound !== - 1) {
				group.groupItems.splice(indexFound, 1);
			}
		}
	)
}