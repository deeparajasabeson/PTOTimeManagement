import { Component } from '@angular/core';
import { Router } from "@angular/router";
import {  NgForm } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { DataStorageService } from '../../_services/datastorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent  {
  invalidLogin: boolean = false;

  constructor( private router: Router,
                        private auth: AuthService,
                        private datastorageService: DataStorageService) { }

  public login(form: NgForm) {
    this.auth.login(form)
      .subscribe(response =>
      {
        let token = (<any>response).token;
        let user = (<any>response).user;
        this.datastorageService.setUserEntity(user);
        localStorage.setItem("jwt", token);

        this.invalidLogin = false;
        this.router.navigate(["/pto-calendar"]);
      }, err => {
              console.log("Error Occured :");
              console.log(err);
              this.invalidLogin = true;
      });
  }
}
