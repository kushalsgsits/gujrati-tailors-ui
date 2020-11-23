import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class PrintService {
	isPrinting = false;

	constructor(private router: Router) { }

	printDocument(documentName: string, documentData: string) {
		console.log(documentName, documentData);
		this.isPrinting = true;
		this.router.navigate(['/',
			{
				outlets: { 'print': ['print', documentName, documentData] }
			}]);
	}

	onDataReady() {
		setTimeout(() => {
			console.log('onDataReady called');
			window.print();
			this.isPrinting = false;
			this.router.navigate([{ outlets: { print: null } }]);
		});
	}
}
