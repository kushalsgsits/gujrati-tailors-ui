import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
	providedIn: 'root'
})
export class PrintService {
	isPrinting = false;
	mainTitle: string;

	constructor(
	  private router: Router,
    private titleService: Title,
    private spinner: NgxSpinnerService
  ) {
		this.mainTitle = this.titleService.getTitle();
	}

	printDocument(documentName: string, documentData: string) {
		console.log(documentName, documentData);
		this.titleService.setTitle(documentName);
		this.router.navigate(['/',
			{
				outlets: { 'print': ['print', documentName, documentData] }
			}]);
	}

	onDataReady() {
    this.spinner.show();
    console.log('Data ready' + this.titleService.getTitle());
    this.isPrinting = true;

    let events = ['touchstart', 'mouseover'];
    const listener = (e) => {
      // Remove event listener as soon as printing finishes
      events.forEach(event => window.removeEventListener(event, listener));
      console.log('Printing finished', this.titleService.getTitle());
      this.isPrinting = false;
      this.titleService.setTitle(this.mainTitle);
      this.router.navigate([{outlets: {print: null}}]);
    }

		setTimeout(() => {
      console.log('Printing started: ' + this.titleService.getTitle());
      // Add event listener to detect completion of printing
      events.forEach(event => window.addEventListener(event, listener));
      window.print();
      this.spinner.hide();
		}, 1000);
	}

}
