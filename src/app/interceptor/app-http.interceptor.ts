import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

	constructor(private auth: AuthService) { }

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		let updatedRequest: HttpRequest<unknown> = request;
		const token: string = this.auth.getToken();
		if (token) {
			updatedRequest = updatedRequest.clone({ headers: updatedRequest.headers.set('Authorization', 'Bearer ' + token) });
		} else {
			console.log('JWT token not available in internal storage');
		}

		if (!request.headers.has('Content-Type')) {
			updatedRequest = updatedRequest.clone({ headers: updatedRequest.headers.set('Content-Type', 'application/json') });
		}

		updatedRequest = updatedRequest.clone({ headers: updatedRequest.headers.set('Accept', 'application/json') });

		console.log('Updated Request: ', updatedRequest);

		return next.handle(updatedRequest).pipe(
			map((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
					console.log('HttpResponse: ', event);
				} else {
					console.log('Other event: ', event);
				}
				return event;
			}),
			catchError(err => {
				let errorMsg: string;
				if (err.error instanceof Error) {
					// A client-side or network error occurred. Handle it accordingly.
					errorMsg = `An error occurred: ${err.error.message}`;
				} else {
					// The backend returned an unsuccessful response code.
					// The response body may contain clues as to what went wrong,
					errorMsg = `Backend returned code ${err.status}, body was: ${err.error}`;
				}
				console.log(errorMsg, err.error);
				if (err.status === 401) {
					this.auth.logout();
				}
				return throwError(err.error);
			})
		);
	}

}
