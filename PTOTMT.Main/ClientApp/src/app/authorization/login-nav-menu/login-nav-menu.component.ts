import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-nav-menu',
  templateUrl: './login-nav-menu.component.html',
  styleUrls: ['./login-nav-menu.component.css']
})
export class LoginNavMenuComponent implements OnInit {
  public isAuthenticated: boolean;
  public userName: string;
  counter: number;

  constructor() { this.counter = 8; }

  ngOnInit() {
  this.isAuthenticated = true;
    this.userName = 'Deepa';
  }

}
