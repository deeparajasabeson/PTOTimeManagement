import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { ErrorDialogService } from '../_services/error-dialog/error-dialog.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(public errorDialogService: ErrorDialogService, public toasterService: ToastrService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.toasterService.success("<h2>Hello, I'm the toastr message.</h2>", "Toaster Message");
   const authToken: string = localStorage.getItem('jwt');
    let newHeaders = req.headers;

    if (!authToken) {
      return next.handle(req);
    }
    // If we have a token, we append it to our new headers
    newHeaders = newHeaders.append('Content-Type', 'application/json')
                                                  .append('Authorization', 'Bearer ${authToken}')
                                                  .append('Accept', 'application/json');
    console.log('Token added to HTTP request');
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const clonedAuthRequest = req.clone({
      headers: newHeaders
    });

    // send cloned request with header to the next handler.
    // we return an Observable that will run the request
    // or pass it to the next interceptor if any
    return next.handle(clonedAuthRequest).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }),
      retry(3),
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          try {
            this.toasterService.error(error.error.message, error.error.title, { positionClass: 'toast-bottom-center' });
          }
          catch (e) {
            this.toasterService.error('An error occurred', '', { positionClass: 'toast-bottom-center' });
          }
        }
        let data;
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          data = {
            reason: error && error.error && error.error.message ? error.error.message : '',
            status: error.status
          };
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          data = {
            reason: error && error.error && error.error.reason ? error.error.reason : '',
            error: 'Error body was: ${error.error}',
            status: 'Backend returned code ${error.status}'
          };
        }
        this.errorDialogService.openDialog(data);
        // return an observable with a user-facing error message
        return throwError(error);
      })) as Observable<HttpEvent<any>>;
 }
}
