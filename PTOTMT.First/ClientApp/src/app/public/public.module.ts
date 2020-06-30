import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBell, faUserPlus, faSignInAlt, faUser, faSignOutAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { LoginNavMenuComponent } from './login-nav-menu/login-nav-menu.component';
import { FooterBarComponent } from './footer-bar/footer-bar.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  {   path: '', redirectTo: 'login', pathMatch: 'full'  },
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'home', loadChildren: './home/home.module#HomeModule' },
      { path: 'register', component: RegisterComponent },
      { path: 'login', loadChildren: './login/login.module#LoginModule' }
    ]
  }
];

@NgModule({
  declarations: [
    PublicLayoutComponent,
    HeaderBarComponent,
    LoginNavMenuComponent,
    FooterBarComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
    ],
  exports: [
    HeaderBarComponent,
    LoginNavMenuComponent,
    FooterBarComponent,
    RouterModule
  ],
  entryComponents: [
    RegisterComponent
  ]
})

export class PublicModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faBell, faSignInAlt, faUserPlus, faUser, faSignOutAlt, faUsers);
  }
}
