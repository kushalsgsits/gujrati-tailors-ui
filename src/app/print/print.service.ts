import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Injectable({
	providedIn: 'root'
})
export class PrintService {
	isPrinting = false;
	mainTitle: string;

	constructor(private router: Router, private titleService: Title) { 
		this.mainTitle = this.titleService.getTitle();
	}

	printDocument(documentName: string, documentData: string) {
		console.log(documentName, documentData);
		this.isPrinting = true;
		this.titleService.setTitle(documentData);
		this.router.navigate(['/',
			{
				outlets: { 'print': ['print', documentName, documentData] }
			}]);
	}

	onDataReady() {
		setTimeout(() => {
			console.log('Printing: ' + this.titleService.getTitle());
			window.print();
			this.isPrinting = false;
			this.titleService.setTitle(this.mainTitle);
			this.router.navigate([{ outlets: { print: null } }]);
		});
	}
}
