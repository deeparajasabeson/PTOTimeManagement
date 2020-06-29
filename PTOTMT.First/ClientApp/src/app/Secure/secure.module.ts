import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { PTOEditorComponent } from './pto-editor/pto-editor.component';
import { QuotaEditorComponent } from './quota-editor/quota-editor.component';
import { FlexEditorComponent } from './flex-editor/flex-editor.component';
import { LogOutComponent } from './logout/logout.component';
import { TeamNotificationsComponent } from './team-notifications/team-notifications.component';
import { UserNotificationsComponent } from './user-notifications/user-notifications.component';
import { WaitingListComponent } from './waiting-list/waiting-list.component';
import { RequestDisplayComponent } from './request-display/request-display.component';

import { StatusNamePipe } from '../_pipes/status-name.pipe';
import { FlexTypeNamePipe } from '../_pipes/flextype-name.pipe';
import { UserNamePipe } from '../_pipes/user-name.pipe';
import { RequestTypeNamePipe } from '../_pipes/requesttype-name.pipe';

import { FlexService } from '../_services/flex.service';
import { FlexTypeService } from '../_services/flextype.service';
import { LocationService } from '../_services/location.service';
import { PTOService } from '../_services/pto.service';
import { QuotaService } from '../_services/quota.service';
import { RequestTypeService } from '../_services/requesttype.service';
import { RoleService } from '../_services/role.service';
import { StatusService } from '../_services/status.service';
import { TeamService } from '../_services/team.service';
import { UserService } from '../_services/user.service';

const customPipes = [
  StatusNamePipe,
  FlexTypeNamePipe,
  UserNamePipe,
  RequestTypeNamePipe
]
const entryComponents = [
  QuotaEditorComponent,
  PTOEditorComponent,
  FlexEditorComponent,
  RequestDisplayComponent
]
const routes: Routes = [
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  {
    path: '',
    component: SecureLayoutComponent,
    children: [
      { path: 'pto-calendar', component: PTOCalendarComponent },
      { path: 'quota-calendar', component: QuotaCalendarComponent },
      { path: 'logout', component: LogOutComponent, runGuardsAndResolvers: 'always' },
      { path: 'user-notifications', component: UserNotificationsComponent },
      { path: 'team-notifications', component: TeamNotificationsComponent },
      { path: 'waitinglist', component: WaitingListComponent },
      { path: 'requestdisplay/:id:isPTO', component: RequestDisplayComponent}
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    SecureLayoutComponent,
    TopMenuComponent,
    PTOCalendarComponent,
    QuotaCalendarComponent,
    LogOutComponent,
    UserNotificationsComponent,
    TeamNotificationsComponent,
    WaitingListComponent,
    customPipes,
    entryComponents
  ],
  entryComponents: [
    entryComponents
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
  providers: [
    AuthGuard,
    FlexService,
    FlexTypeService,
    LocationService,
    PTOService,
    QuotaService,
    RequestTypeService,
    RoleService,
    StatusService,
    TeamService,
    UserService,
    customPipes
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA ]
})
export class SecureModule {
    constructor(library: FaIconLibrary) {
      library.addIcons(faLock);
  }
}
