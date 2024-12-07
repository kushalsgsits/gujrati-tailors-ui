import {Component, OnDestroy, OnInit} from '@angular/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
// tslint:disable-next-line:no-duplicate-imports
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {PrintService} from '../../print/print.service';
import {BillService} from '../bill.service';
import {map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {BillItem, StudioBill} from '../studio-bill';
import {calcBillTotalUtil} from '../../utils';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-bill-edit',
  templateUrl: './bill-edit.component.html',
  styleUrls: ['./bill-edit.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class BillEditComponent implements OnInit, OnDestroy {

  billForm: FormGroup;
  selectedItemsOld: string[];
  mySubscription: any;
  shirtingCount = 0;
  suitingCount = 0;
  accessoriesCount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billService: BillService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private printService: PrintService
  ) {
    console.log('BillEditComponent.constructor');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
    console.log('BillEditComponent.constructor done');
  }

  ngOnInit(): void {
    this.initBill();
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  private initBill() {
    console.log('BillEditComponent.initBill');
    // TODO fix spinner in inOnInit
    this.spinner.show().then();
    this.route.params
    .pipe(
      map(p => p.id),
      switchMap(id => {
        console.log('Finding StudioBill with id', id);
        if (id === 'new') {
          console.log('Creating new StudioBill');
          const studioBill = new StudioBill();
          studioBill.billDate = moment();
          studioBill.itemIds = [];
          studioBill.billItems = [];
          return of(studioBill);
        }
        return this.billService.findById(id);
      })
    )
    .subscribe(
      bill => {
        console.log('Found StudioBill', bill);
        this.selectedItemsOld = [];
        bill.billItems.forEach(x => this.selectedItemsOld.push(x.id));
        bill.itemIds = this.selectedItemsOld;
        this.initBillForm(bill);
        this.spinner.hide().then();
      },
      errResponse => {
        console.error('Error finding StudioBill', errResponse);
        this.spinner.hide().then();
        alert(errResponse.errorMessage);
        this.router.navigate(['/studio/bills/new']).then();
      }
    );
  }

  private initBillForm(bill: StudioBill) {
    console.log('Initializing Bill form with StudioBill', bill);
    this.billForm = this.fb.group({
      billDate: [bill.billDate, Validators.required],
      customer: this.fb.group({
        name: [bill.customer ? bill.customer.name : '', Validators.required],
        mobile: [bill.customer ? bill.customer.mobile : '', [Validators.required, Validators.pattern('[\\d]{10}$')]],
      }),
      billItems: this.fb.array(this.getBillItemsFormGroupArrayFromBillItems(bill.billItems), Validators.required),
      notes: [bill.notes, Validators.maxLength(300)],
      // These are not linked to any UI input control
      _links: [bill._links]
    });
    if (this.isEditing) {
      this.billForm.get('billNumber').disable();
      this.billForm.get('billDate').disable();
    }
    console.log('Initialized Bill form: ', this.billForm.getRawValue());
  }

  getBillItemsFormGroupArrayFromBillItems(billItems: BillItem[]): FormGroup[] {
    const arr: FormGroup[] = [];
    // tslint:disable-next-line:triple-equals
    if (null == billItems || billItems.length == 0) {
      return arr;
    }
    billItems.forEach(x => arr.push(this.getBillItemsFormGroupArrayFromBillItem(x)));
    return arr;
  }

  getBillItemsFormGroupArrayFromBillItem(billItem: BillItem): FormGroup {
    return this.fb.group({
      id: [billItem.id, Validators.required],
      quantity: [billItem.quantity, [Validators.required, Validators.pattern('^\\d+(\\.\\d{1,2})?$'), Validators.min(0.1)]],
      rate: [billItem.rate, [Validators.required, Validators.pattern('[1-9][0-9]{0,3}')]]
    });
  }

  get billItems(): FormArray {
    return this.billForm.get('billItems') as FormArray;
  }

  onSubmit() {
    this.save();
  }

  private save() {
    this.spinner.show().then();
    const billToBeSaved: StudioBill = this.billForm.getRawValue();
    console.log('Saving StudioBill', billToBeSaved);
    this.billService.save(billToBeSaved).subscribe(
      bill => {
        console.log('StudioBill saved successfully', bill);
        alert('StudioBill saved successfully');
        this.spinner.hide().then();
        this.router.navigate(['/studio/bills/new']).then(value => {
          this.printService.printDocument('invoice', bill._links.self.href);
        });
      },
      errResponse => {
        this.spinner.hide().then();
        alert(errResponse.errorMessage);
      }
    );
  }

  onCancel() {
    this.router.navigate(['/studio/bills']);
  }

  get isEditing(): boolean {
    return this.billForm != null && this.billForm.get('_links').value != null;
  }

  calcBillTotal(bill: StudioBill) {
    return calcBillTotalUtil(bill);
  }

  addBillItem(itemType: string) {
    const billItem = new BillItem();
    billItem.rate = 0;

    let defaultItemName = itemType + '_';

    switch (itemType) {
      case 'Shirting': {
        defaultItemName += ++this.shirtingCount;
        billItem.quantity = 1.6;
        break;
      }
      case 'Suiting': {
        defaultItemName += ++this.suitingCount;
        billItem.quantity = 3.0;
        break;
      }
      case 'Accessories': {
        defaultItemName += ++this.accessoriesCount;
        billItem.quantity = 1;
        break;
      }
    }
    billItem.id = prompt('Please enter item name', defaultItemName);
    const billItemFormGroup = this.getBillItemsFormGroupArrayFromBillItem(billItem);
    this.billItems.push(billItemFormGroup);
  }

}
