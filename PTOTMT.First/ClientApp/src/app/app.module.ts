import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import { JwtModule } from "@auth0/angular-jwt";
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './public/pagenotfound/pagenotfound.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { AlertComponent } from './public/alert/alert.component';

import { ErrorDialogService } from './_services/error-dialog.service';
import { AuthService } from './_services/auth.service';
import { DataStorageService } from './_services/datastorage.service';
import { DataSharingService } from './_services/datasharing.service';
import { HttpConfigInterceptor } from './_interceptors/HttpConfigInterceptor';
//import { httpInterceptorProviders } from './_interceptors/index';
import { StatusNamePipe } from './_pipes/status-name.pipe';
import { FlexNamePipe } from './_pipes/flex-name.pipe';

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
    AlertComponent,
    StatusNamePipe,
    FlexNamePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatDialogModule,
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
        whitelistedDomains: ["localhost:5000"],
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
    DataStorageService,
    DataSharingService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
  ],
  entryComponents: [ErrorDialogComponent],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
