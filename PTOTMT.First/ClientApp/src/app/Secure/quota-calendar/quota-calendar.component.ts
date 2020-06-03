import { Component, OnInit, ViewChild } from '@angular/core';
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
import { QuotaFromDBEntity } from '../../_entities/QuotaFromDBEntity';
import { QuotaService } from '../../_services/quota.service';
import { DataStorageService } from '../../_services/datastorage.service';
import { UserEntity } from '../../_entities/UserEntity';


@Component({
  selector: 'app-quota-calendar',
  templateUrl: './quota-calendar.component.html'
})
export class QuotaCalendarComponent implements OnInit {
  @ViewChild('calendar', null) calendarComponent: FullCalendarComponent; // references #calendar in the template
  eventColor: string[] = ["red", "green", "blue", "brown", "BlueViolet", "gray", "cyan", "CadetBlue", "DarkGoldenRod", "DarkKhaki", "DarkGreen", "DarkRed", "DarkOrange", "DarkSeaGreen", "DarkSlateGrey", "Indigo", "LightSeaGreen", "LightSalmon", "maroon", "MediumVioletRed", "Chocolate", "CornflowerBlue", "Black", "Coral"];
  originalHours = 0;
  isNewEvent = true;
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin]; // important!
  calendarWeekends = true;
  calendarEvents: EventInput[] = [];
  options: any;
  user = null;
  previousDate = null;
  toDate = new Date();
  toDateNgbDateStruct: NgbDateStruct= {
    year: this.toDate.getFullYear(),
    month: this.toDate.getMonth() + 1,
    day: this.toDate.getDate()
  }

  quota: QuotaDialogData = {
    id: "",
    quotaName: "",
    originalHours: 0,
    remainingHours: 0,
    startDate: this.toDateNgbDateStruct,
    startTime: "00:00",
    endDate: this.toDateNgbDateStruct,
    endTime: "00:00",
    description: ""
  }
  static subscribeData: any;
  static setSubscribeData(data): any {
    QuotaCalendarComponent.subscribeData = data;
    return data;
  }

  static subscribeQuotaFromDBEntity: QuotaFromDBEntity;
  static setSubscribeQuotaFromDBEntity(quota): QuotaFromDBEntity {
    QuotaCalendarComponent.subscribeQuotaFromDBEntity = quota;
    return quota;
  }
  // Constructor - executes when component is created first
  constructor(public dialog: MatDialog,
                       private quotaService: QuotaService,
                       private datastorageService: DataStorageService) { }

  // Execute after constructor when component is initialized
  ngOnInit() {
    this.options = {
      customButtons: {
        newquota: {
          text: 'New PTO Quota',
          click: () => this.getQuota(null)    // click: this.getQuota(null).bind(this) // <-------- CAN ALSO USE THIS ONE
        }
      },
      header: {
        left: 'prev,next today newquota',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }
    };
    this.readQuotasbyTeamId();
  }

  //Read Quotas by Team Id
  readQuotasbyTeamId() {
    let teamId: string = this.datastorageService.getUserEntity().teamFunctionId;
    let response = this.quotaService.getQuotasByTeamId(teamId);
    response .subscribe((data: QuotaFromDBEntity[]) => {
        QuotaCalendarComponent.setSubscribeData(data);
      });

    let quotaList = QuotaCalendarComponent.subscribeData;
    if (quotaList == null) {
      return
    }
    for (var i = 0; i < quotaList.length; ++i) {
      this.calendarEvents[i] =
      {
        allDay: false,
        backgroundColor: this.eventColor[Math.floor(Math.random() * (this.eventColor.length - 1 - 0) + 0)],
        textColor: "white",
        title: quotaList[i].name,
        start: quotaList[i].startDateTime,
        end: quotaList[i].endDateTime,
        id: quotaList[i].id,
        extendedProps: {
          description: quotaList[i].description,
          originalHours: quotaList[i].originalHours,
          remainingHours: quotaList[i].remainingHours,
          teamId: quotaList[i].teamId,
          isActive: quotaList[i].isActive,
          createdBy: quotaList[i].createdBy,
          createdOn: quotaList[i].createdOn,
          updatedBy: quotaList[i].updatedBy,
          updatedOn: quotaList[i].updatedOn
         }
      };
    }
  }

  //eventRender function from Calendar
  eventRender(info) {
    var attr_tooltip = document.createAttribute("data-tooltip");
    var attr_title = document.createAttribute("title");
    attr_tooltip.value = "";
    attr_title.value = info.event.extendedProps.description.trim()
      + "  Original Hours : " + info.event.extendedProps.originalHours
      + "  Remaining Hours : " + info.event.extendedProps.remainingHours;
    info.el.setAttributeNode(attr_tooltip);
    info.el.setAttributeNode(attr_title);
}

  // Edit Quota when event is clicked
  handleEventClick(info) {
    let quotaId = info.event.id;
    if (quotaId == null) {
      return;
    }

    let response = this.quotaService.getQuotaById(quotaId);
    response.subscribe((data: QuotaFromDBEntity) => {
      QuotaCalendarComponent.setSubscribeQuotaFromDBEntity(data);
    });

    let quotaToEdit = QuotaCalendarComponent.subscribeQuotaFromDBEntity;
    if (quotaToEdit == null) {
      return
    }

    let startDateTime = new Date(quotaToEdit.startDateTime);
    let quotaStartDate: NgbDateStruct = {
      year: startDateTime.getFullYear(),
      month: startDateTime.getMonth() + 1,
      day: startDateTime.getDate()
    }

    let endDateTime = new Date(quotaToEdit.endDateTime);
    let quotaEndDate: NgbDateStruct = {
      year: endDateTime.getFullYear(),
      month: endDateTime.getMonth() + 1,
      day: endDateTime.getDate()
    }

    this.quota.id = quotaToEdit.id;
    this.quota.quotaName = quotaToEdit.name,
    this.quota.originalHours = quotaToEdit.originalHours;
    this.quota.remainingHours = quotaToEdit.remainingHours;
    this.quota.startDate = quotaStartDate;
    this.quota.startTime = quotaToEdit.startDateTime.substr(11, 5);
    this.quota.endDate = quotaEndDate;
    this.quota.endTime = quotaToEdit.endDateTime.substr(11, 5);
    this.quota.description = quotaToEdit.description;

    this.isNewEvent = false;
    this.originalHours = quotaToEdit.originalHours;
    this.getQuota(null);
    this.isNewEvent = true;
    this.originalHours = 0;
  }

  // Get New Quota and set start date
  getQuota(startDate: Date): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;   // User can't close the dialog by clicking outside its body
    dialogConfig.autoFocus = true;
    dialogConfig.id = "quota-editor";
    dialogConfig.height = "60%";
    dialogConfig.width = "70%";
    dialogConfig.data = { quota: this.quota };  // One way to pass data to modal window
    if (startDate != null) {
      dialogConfig.data.quota.startDate = startDate;
    }
    const dialogRef = this.dialog.open(QuotaEditorComponent, dialogConfig);
    dialogRef.componentInstance.quota = this.quota;  //another way to pass quota to modal window

    dialogRef.afterClosed().subscribe(resultData => {
      if (resultData != null && resultData != undefined) {
        this.quota = resultData;
        this.saveQuota();
      }
    });
  }

  // Save Quota
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

    let id, remainingHours;
    if (this.quota.id == "" && this.isNewEvent) {
      id = this.generateUUID();
      remainingHours = this.quota.originalHours;
    }
    else {
      id = this.quota.id;
      remainingHours = this.quota.remainingHours + (this.quota.originalHours - this.originalHours);
    }
    const quotaEntity: QuotaEntity = {
      id: id,
      name: this.quota.quotaName,
      description: this.quota.description,
      originalHours: this.quota.originalHours,
      remainingHours: remainingHours,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      teamId: userDetails.teamFunctionId,
      isActive: true,
      createdBy: userDetails.id,
      createdOn: this.toDate,
      updatedBy: userDetails.id,
      updatedOn: this.toDate
    };
    let quota = this.quotaService.saveQuota(quotaEntity);
    if (quota == null) {
      return;
    }

    this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
      title: quotaEntity.name,
      start: startDateTime,
      end: endDateTime,
      id: quotaEntity.id,
      allDay: false,
      color: this.eventColor[Math.floor(Math.random() * (this.eventColor.length - 1 - 0) + 0)],
      textColor: "white"
    })
    let calendarApi = this.calendarComponent.getApi();
    if (calendarApi.needsRerender) {
      calendarApi.render();
    }
  }

  //Generating GUID in Typescript
  generateUUID() {      
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

  // Check whether User is authenticated
  isUserAuthenticated(): boolean {
    let token: string = localStorage.getItem("jwt");
    return(token) ? true : false;
  }

// Toggle calendar visibility
  toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }

  // Toogle calendar Weekends
  toggleWeekends() {
    this.calendarWeekends = !this.calendarWeekends;
  }

  // Go to date passed as argument in calendar
  gotoDate(date: Date) {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(date);
  }

  // Execute when date cell is clicked
  handleDateClick(arg) {
    this.getQuota(arg.date);
  }
}

