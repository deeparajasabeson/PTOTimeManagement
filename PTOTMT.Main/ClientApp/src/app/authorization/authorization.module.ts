import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { LoginNavMenuComponent } from './login-nav-menu/login-nav-menu.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBell, faUserPlus, faSignInAlt, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    LoginNavMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(
      [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'logout', component: LogoutComponent }
      //, canActivate: [AuthorizeGuard]
    ]),
    FontAwesomeModule
  ],
  exports: [LoginNavMenuComponent, LoginComponent, LogoutComponent]
})
export class AuthorizationModule {
    constructor(library: FaIconLibrary) {
      library.addIcons(faBell, faSignInAlt, faUserPlus, faUser, faSignOutAlt);
  }
}
