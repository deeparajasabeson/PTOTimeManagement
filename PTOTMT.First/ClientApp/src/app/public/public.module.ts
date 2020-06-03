import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBell, faUserPlus, faSignInAlt, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../_services/auth.service';

import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { LoginNavMenuComponent } from './login-nav-menu/login-nav-menu.component';
import { FooterBarComponent } from './footer-bar/footer-bar.component';


const routes: Routes = [
  {   path: '', redirectTo: 'login', pathMatch: 'full'  },
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'home', loadChildren: './home/home.module#HomeModule' },
      { path: 'register', loadChildren: './register/register.module#RegisterModule' },
      { path: 'login', loadChildren: './login/login.module#LoginModule' },
      { path: 'loggedout', loadChildren: './loggedout/loggedout.module#LoggedoutModule' } 
    ]
  }
];

@NgModule({
  declarations: [
    PublicLayoutComponent,
    HeaderBarComponent,
    LoginNavMenuComponent,
    FooterBarComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FontAwesomeModule,
    RouterModule.forChild(routes)
    ],
  exports: [
    HeaderBarComponent,
    LoginNavMenuComponent,
    FooterBarComponent,
    RouterModule
  ],
  providers: [
    AuthService
  ]
})

export class PublicModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faBell, faSignInAlt, faUserPlus, faUser, faSignOutAlt);
  }
}
