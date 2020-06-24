import { Component, OnInit } from '@angular/core';
import { LoginNavMenuComponent } from '../../public/login-nav-menu/login-nav-menu.component';
import { AuthService } from '../../_services/auth.service';

@Component({
  providers: [LoginNavMenuComponent],
  selector: 'app-loggedout',
  template: '<p align ="center">   You are successfully logged out now !! '
})
export class LogOutComponent implements OnInit {
  constructor(private authService: AuthService,
                      private loginNavMenu: LoginNavMenuComponent) { }

  ngOnInit() {
    this.authService.logOut();
    this.loginNavMenu.ngOnInit();
  }
}
