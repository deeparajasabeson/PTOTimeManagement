import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { ErrorDialogService } from '../_services/error-dialog.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(
    public errorDialogService: ErrorDialogService,
    public toasterService: ToastrService,
    public router: Router) { }

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
    newHeaders = newHeaders.append('Content-Type', 'application/json')
                                                  .append('Authorization', 'Bearer ' +  authToken)
                                                  .append('Accept', 'application/json');
    const clonedAuthRequest = req.clone({
      headers: newHeaders
    });

    return next.handle(clonedAuthRequest).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      retry(3),
      catchError((error: any) => {
        //if (error instanceof HttpErrorResponse) {
        //    this.toasterService.error(
        //      error.message,
        //      error.error.title,
        //      { positionClass: 'toast-bottom-center' });
        //}
        let data = {
          reason:  (error.error.errors && error.error.errors["$.id"]) ? error.error.errors["$.id"][0] 
                      : (error.error.errors && error.error.errors["$.statusId"]) ? error.error.errors["$.statusId"][0]
                      : "",
          error: error.message,
          statuscode: error.status,
          title: error.error.title
        };
        if (error.status != '' || data.reason != '') {
          this.errorDialogService.openDialog(data);
        }
        if (error.status == 401 || error.status == 403) {
           this.toasterService.error(
              error.message,
              error.error.title,
              { positionClass: 'toast-bottom-center' });
          this.router.navigateByUrl("/login");
        }
        return throwError(error);
      })
    ) as Observable<HttpEvent<any>>;
 }
}
