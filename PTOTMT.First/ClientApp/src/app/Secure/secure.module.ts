import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AuthGuard } from '../_guards/auth.guard';
import { PublicModule } from '../public/public.module';
import { MaterialModule } from './material.module';

import { SecureLayoutComponent } from './secure-layout/secure-layout.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { PTOCalendarComponent } from './pto-calendar/pto-calendar.component';
import { QuotaCalendarComponent } from './quota-calendar/quota-calendar.component';
import { LogoutComponent } from './logout/logout.component';
import { QuotaEditorComponent } from './quota-editor/quota-editor.component';

const routes: Routes = [
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  {
    path: '',
    component: SecureLayoutComponent,
    children: [
      { path: 'pto-calendar', component: PTOCalendarComponent },
      { path: 'quota-calendar', component: QuotaCalendarComponent },
      {
        path: 'logout',
        component: LogoutComponent,
        runGuardsAndResolvers: 'always'
      }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    SecureLayoutComponent,
    TopMenuComponent,
    PTOCalendarComponent,
    LogoutComponent,
    QuotaCalendarComponent,
    QuotaEditorComponent
  ],
  entryComponents: [
    QuotaEditorComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FontAwesomeModule,
    FullCalendarModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule ,
    PublicModule,
    MaterialModule,
    RouterModule.forChild( routes )
  ],
  exports: [ RouterModule ], 
  providers: [AuthGuard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class SecureModule {
    constructor(library: FaIconLibrary) {
      library.addIcons(faLock);
  }
}