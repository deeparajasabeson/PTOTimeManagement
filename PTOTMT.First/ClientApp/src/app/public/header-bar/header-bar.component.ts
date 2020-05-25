import { Component, Input } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderBarComponent {
  isAuthenticated: boolean;
  isExpanded = false;

  constructor(private jwtHelper: JwtHelperService) { }

  ngOnInit() {
    this.isAuthenticated = this.isUserAuthenticated();
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  isUserAuthenticated() {
    let token: string = localStorage.getItem("jwt");
    return (token && !this.jwtHelper.isTokenExpired(token)) ? true : false;
  }
}

