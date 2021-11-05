import { SelectItem, SelectItemGroup, Order } from './order/order';

export function getSelectItem(itemId: string, groupedItemsWithRate: SelectItemGroup[]) : SelectItem {
	let result: SelectItem = null;
	groupedItemsWithRate.forEach(
		group => {
			if (result !== null) {
				return;
			}
			group.groupItems.forEach(
				item => {
					if (item.id === itemId) {
						result = item;
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
			group.groupItems.forEach(
				(item, index) => {
					if (item.id === 'safariShirt') {
						indexFound = index;
					}
				}
			)
			if (indexFound !== - 1) {
				group.groupItems.splice(indexFound, 1);
			}
		}
	)
}

export function calcOrderTotalUtil(order: Order) {
	let total = 0;
	order.orderItems.forEach(
		orderItem => {
			total += orderItem.quantity * orderItem.rate;
		}
	)
	return total;
}