import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: ''
})
export class LogoutComponent implements OnInit {
  constructor(public router: Router) { }

  ngOnInit() {
    this.logOut();
  }

  logOut() {
    localStorage.removeItem("jwt");
    this.router.navigate(['/loggedout']);
  }
}

