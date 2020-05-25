import { Component, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import { MatDialog,  MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogConfig } from '@angular/material/dialog';

import { QuotaEditorComponent } from '../quota-editor/quota-editor.component';
import { QuotaDialogData } from '../_models/QuotaDialogData';
import { QuotaEntity } from '../_entities/QuotaEntity';
import { QuotaService } from '../../_services/quota/quota.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quota-calendar',
  templateUrl: './quota-calendar.component.html'
})
export class QuotaCalendarComponent {
  quota: QuotaDialogData = {
    quotaName: "Christmas",
    hours: 50,
    startDate: new Date(),
    startTime: "10:30",
    endDate: new Date(),
    endTime: "20:30",
    description: "Holidays during Christmas Eve"
  }
  previousDate = null;
  // references the #calendar in the template
  @ViewChild('calendar', null) calendarComponent: FullCalendarComponent; // the #calendar in the template

  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin]; // important!
  calendarWeekends = true;
  calendarEvents: EventInput[] = [
    { title: 'Event Now', start: new Date() }
  ];

  constructor(public dialog: MatDialog, private router: Router, private quotaService: QuotaService) { }

  getNewQuota(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;   // The user can't close the dialog by clicking outside its body
    dialogConfig.autoFocus    = true;
    dialogConfig.id                 = "quota-editor";
    dialogConfig.height          = "60%";
    dialogConfig.width           = "70%";
    dialogConfig.data = {  quota: this.quota };

    const dialogRef = this.dialog.open(QuotaEditorComponent, dialogConfig);
    dialogRef.componentInstance.quota = this.quota;

    dialogRef.afterClosed().subscribe(resultData => {
      if (resultData != null) {
        this.quota = resultData;
        this.saveQuota();
      }
    });
  }

  saveQuota() {
    const quotaEntity: QuotaEntity = {
      Id: "",
      Name: this.quota.quotaName,
      Description: this.quota.description,
      OriginalHours: this.quota.hours,
      RemainingHours:0,
      StartDateTime: this.quota.startDate,
      EndDateTime: this.quota.endDate,
      TeamId: this.user.TeamId,
      IsActive: true,
      CreatedBy: this.user.Id,
      CreatedOn: new Date(),
      UpdatedBy: "",
      UpdatedOn: null
    };
    
    this.quotaService.saveQuota(quotaEntity)
      .subscribe(response => {
        console.log("response from saveQuota() in QuotaService");
        console.log(response);
      }, err => {
              console.log("Error Occured :");
              console.log(err);
      }
    );
  }

  isUserAuthenticated(): boolean {
    let token: string = localStorage.getItem("jwt");
    if (token) {
      return true;
    }
    else {
      return false;
    }
  }

  toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }

  toggleWeekends() {
    this.calendarWeekends = !this.calendarWeekends;
  }

  gotoPast() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate('2005-12-29'); // call a method on the Calendar object
  }

  someMethod() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
  }

  handleDateClick(arg) {
    // change the day's background color just for fun
    if (this.previousDate !== null) {
      this.previousDate.dayEl.style.backgroundColor = 'blue';
    }
    this.previousDate = arg;
    arg.dayEl.style.backgroundColor = 'red';
    this.getNewQuota();
     this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
       title: this.quota.quotaName,
        start: arg.date,
        allDay: arg.allDay
      })
  }
}

