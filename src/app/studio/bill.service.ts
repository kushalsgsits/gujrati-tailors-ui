import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StudioBill, StudioBillFilter} from './studio-bill';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  api = environment.apiUrl + 'studio/bills';

  constructor(private http: HttpClient) {
  }

  findById(id: string): Observable<StudioBill> {
    const url = `${this.api}/${id}`;
    return this.http.get<StudioBill>(url);
  }

  load(filter: StudioBillFilter): Observable<any> {
    return this.find(filter);
  }

  find(filter: StudioBillFilter): Observable<any> {
    const params = {
      billDateStart: filter.billDateStart ? filter.billDateStart.toISOString() : '',
      billDateEnd: filter.billDateEnd ? filter.billDateEnd.toISOString() : '',
      billNumber: filter.billNumber,
      mobile: filter.mobile,
      size: filter.size,
      sort: filter.sort
    };
    const url = this.api + '/customSearch';
    return this.http.get<any>(url, { params });
  }

  save(bill: StudioBill): Observable<StudioBill> {
    let url = '';
    if (bill._links) {
      // TODO directly use order._links.self.href as URL for PUT
      // Currently, we cannot use because of issue in GCP:https://issuetracker.google.com/u/0/issues/168085785
      url = this.api + '/' +  bill.billNumber;
      return this.http.put<StudioBill>(url, bill);
    } else {
      url = `${this.api}`;
      return this.http.post<StudioBill>(url, bill);
    }
  }

  delete(bill: StudioBill): Observable<StudioBill> {
    // TODO directly use order._links.self.href as URL for PUT
    // Currently, we cannot use because of issue in GCP:https://issuetracker.google.com/u/0/issues/168085785
    const url = this.api + '/' + bill.billNumber;
    return this.http.delete<StudioBill>(url);
  }
}
