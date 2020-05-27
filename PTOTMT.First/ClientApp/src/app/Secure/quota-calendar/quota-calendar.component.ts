import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import { MatDialog,  MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogConfig } from '@angular/material/dialog';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { QuotaEditorComponent } from '../quota-editor/quota-editor.component';
import { QuotaDialogData } from '../../_models/QuotaDialogData';
import { QuotaEntity } from '../../_entities/QuotaEntity';
import { QuotaService } from '../../_services/quota/quota.service';
import { DataStorageService } from '../../_services/datastorage/datastorage.service';
import { UserEntity } from '../../_entities/UserEntity';


@Component({
  selector: 'app-quota-calendar',
  templateUrl: './quota-calendar.component.html'
})
export class QuotaCalendarComponent implements OnInit {
  public user;
  toDate = new Date();

  toDateNgbDateStruct: NgbDateStruct= {
    year: this.toDate.getFullYear(),
    month: this.toDate.getMonth(),
    day: this.toDate.getDate()
  }

  quota: QuotaDialogData = {
    quotaName: "",
    hours: 0,
    startDate: this.toDateNgbDateStruct,
    startTime: "00:00",
    endDate: this.toDateNgbDateStruct,
    endTime: "00:00",
    description: ""
  }

  previousDate = null;
  @ViewChild('calendar', null) calendarComponent: FullCalendarComponent; // references #calendar in the template
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin]; // important!
  calendarWeekends = true;
  calendarEvents: EventInput[] = [];
  eventColor: string[] = ["red", "green", "blue", "brown", "yellow", "gray", "cyan"];
 
  constructor(public dialog: MatDialog,
                       private router: Router,
                       private quotaService: QuotaService,
                       private datastorageService: DataStorageService) { }

  ngOnInit() {
    this.readQuotasbyTeamId();
  }
  static subscribeData: any;
  static setSubscribeData(data): any {
    QuotaCalendarComponent.subscribeData = data;
    return data;
  }

  readQuotasbyTeamId() {
    let teamId: string = this.datastorageService.getUserEntity().teamFunctionId;
    this.quotaService.getQuotasByTeamId(teamId)
      .subscribe((data: QuotaEntity[]) => {
        QuotaCalendarComponent.setSubscribeData(data);
      })

    let quotaList = QuotaCalendarComponent.subscribeData;
    if (quotaList != null) {
      for (var i = 0; i < quotaList.length; ++i) {
        this.calendarEvents[i] =
        {
          title: quotaList[i].name,
          start: quotaList[i].startDateTime,
          end: quotaList[i].endDateTime,
          id: quotaList[i].id,
          allDay: false,
          color: this.eventColor[Math.floor(Math.random() * (this.eventColor.length - 1 - 0) + 0)],
          textColor: "white"
        };
      }
    }
  }

  getNewQuota(startDate: Date): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;   // The user can't close the dialog by clicking outside its body
    dialogConfig.autoFocus = true;
    dialogConfig.id = "quota-editor";
    dialogConfig.height = "60%";
    dialogConfig.width = "70%";
    dialogConfig.data = { quota: this.quota };
    if (startDate != null) {
      dialogConfig.data.quota.startDate = startDate;
    }
    const dialogRef = this.dialog.open(QuotaEditorComponent, dialogConfig);
    dialogRef.componentInstance.quota = this.quota;  //another way to pass quota to modal window

    dialogRef.afterClosed().subscribe(resultData => {
      if (resultData != null) {
        this.quota = resultData;
        this.saveQuota();
      }
    });
  }

  saveQuota() {
    let userDetails: UserEntity = this.datastorageService.getUserEntity();

    let startDateTime = new Date(
      this.quota.startDate.year,
      this.quota.startDate.month,
      this.quota.startDate.day,
      parseInt(this.quota.startTime.substr(0, 2)),
      parseInt(this.quota.startTime.substr(3, 2)));

    let endDateTime = new Date(
      this.quota.endDate.year,
      this.quota.endDate.month,
      this.quota.endDate.day,
      parseInt(this.quota.endTime.substr(0, 2)),
      parseInt(this.quota.endTime.substr(3, 2)));

    const quotaEntity: QuotaEntity = {
      Id: this.generateUUID(),
      Name: this.quota.quotaName,
      Description: this.quota.description,
      OriginalHours: this.quota.hours,
      RemainingHours: 0,
      StartDateTime: startDateTime,
      EndDateTime: endDateTime,
      TeamId: userDetails.teamFunctionId,
      IsActive: true,
      CreatedBy: userDetails.id,
      CreatedOn: this.toDate,
      UpdatedBy: userDetails.id,
      UpdatedOn: this.toDate
    };
    let quota = this.quotaService.saveQuota(quotaEntity);
    if (quota != null) {
      this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
        title: quotaEntity.Name,
        start: startDateTime,
        end: endDateTime,
        id: quotaEntity.Id,
        allDay: false,
        color: this.eventColor[Math.floor(Math.random() * (this.eventColor.length - 1 - 0) + 0)],
        textColor: "white"
      })
    }
  }
  
  generateUUID() {                               //Generating GUID in Typescript
    var d = new Date().getTime();
      var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
      //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16; //random number between 0 and 16
      if (d > 0) {  //Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {  //Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
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
    this.getNewQuota(arg.date);
  }
}

