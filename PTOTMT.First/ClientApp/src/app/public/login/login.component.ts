import { Component } from '@angular/core';
import { Router } from "@angular/router";
import {  NgForm } from '@angular/forms';
import { AuthService } from '../../_services/auth/auth.service';
import { UserService } from '../../_services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent  {
  invalidLogin: boolean = false;

  constructor( private router: Router,
                        private auth: AuthService,
                        private userService: UserService) { }

  public login(form: NgForm) {
    this.auth.login(form)
      .subscribe(response =>
      {
        let token = (<any>response).token;
        let user = (<any>response).user;
        this.userService.setUserEntity(user);
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
