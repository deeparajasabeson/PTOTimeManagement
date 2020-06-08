import { Component, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'send-email',
  templateUrl: './send-email.component.html'
})
export class SendEmailComponent   {
  constructor(injector: Injector, private http: HttpClient) {  }

  sendEmail(mailMessage: any) {
    let headers = new HttpHeaders();

    headers = headers.set('Accept', 'application/json');

    if (mailMessage) {
      headers = headers.set('Content-Type', 'application/json');
    }

    this.http.post(`http://localhost:5000/api/mail/sendmail`, mailMessage, {
      headers
    }).subscribe(result => {
      console.log("Email sent!");
    });
  }
}
