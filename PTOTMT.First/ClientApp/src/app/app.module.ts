import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import { JwtModule } from "@auth0/angular-jwt";
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './public/pagenotfound/pagenotfound.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { AlertComponent } from './public/alert/alert.component';

import { ErrorDialogService } from './_services/error-dialog/error-dialog.service';
import { AuthService } from './_services/auth/auth.service';
import { UserService } from './_services/user/user.service';
import { HttpConfigInterceptor } from './_interceptors/HttpConfigInterceptor';
//import { httpInterceptorProviders } from './_interceptors/index';

import { PublicModule } from './public/public.module';
import { SecureModule } from './secure/secure.module';


const routes: Routes = [
  { path: 'pagenotfound', component: PageNotFoundComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

export function tokenGetter() {
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    ErrorDialogComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      enableHtml: true,
      timeOut: 10000,
      positionClass: 'bottom-right',
      preventDuplicates: true,
      closeButton: true
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [],
        blacklistedRoutes: []
      }
    }),
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),
    PublicModule,
    SecureModule
  ],
  providers: [
    AuthService,
    ErrorDialogService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
  ],
  entryComponents: [ErrorDialogComponent],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
