import {Customer} from '../order/order';

export class StudioBill {
  billDate;
  billNumber: number;
  itemIds: string[];
  billItems: BillItem[];
  customer: Customer;
  notes: string;
  _links: any;
}

export class BillItem {
  id: string;
  rate: number;
  quantity: number;
}

export class StudioBillFilter {
  billDateStart;
  billDateEnd;
  billNumber = '';
  mobile = '';
  sort = '';
  size = '';
}
