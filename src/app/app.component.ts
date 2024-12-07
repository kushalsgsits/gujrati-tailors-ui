import {Component} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {PrintService} from './print/print.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public auth: AuthService, public printService: PrintService) {

  }

  logout() {
    this.auth.logout();
  }
}
