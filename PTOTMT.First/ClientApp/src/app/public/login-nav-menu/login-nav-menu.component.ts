import { Component, OnInit, Input } from '@angular/core';
import { MatBadgeModule } from '@angular/material';

@Component({
  selector: 'app-login-nav-menu',
  templateUrl: './login-nav-menu.component.html',
  styleUrls: ['./login-nav-menu.component.css']
})
export class LoginNavMenuComponent implements OnInit {
   public userName: string;
  counter: number;
  @Input() isAuthenticated: boolean;

  constructor() { this.counter = 8; }

  ngOnInit() {
    this.userName = 'Deepa';
  }
}
