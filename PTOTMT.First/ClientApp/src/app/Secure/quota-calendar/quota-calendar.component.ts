import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';

import { CommonLibrary } from '../../_library/common.library';
import { QuotaEditorComponent } from '../quota-editor/quota-editor.component';
import { QuotaDialogData } from '../../_viewmodels/QuotaDialogData';
import { QuotaEntity } from '../../_entities/QuotaEntity';
import { QuotaFromDBEntity } from '../../_entities/QuotaFromDBEntity';
import { UserFromDBEntity } from '../../_entities/UserFromDbEntity';
import { QuotaService } from '../../_services/quota.service';
import { DataStorageService } from '../../_services/datastorage.service';


@Component({
  selector:'app-quota-calendar',
  templateUrl: './quota-calendar.component.html'
})
export class QuotaCalendarComponent implements OnInit {
  @ViewChild('calendar', null) calendarComponent: FullCalendarComponent; // references #calendar in the template
  eventColor: string[] = ["red", "green", "blue", "brown", "BlueViolet", "gray", "cyan", "CadetBlue", "DarkGoldenRod", "DarkKhaki", "DarkGreen", "DarkRed", "DarkOrange", "DarkSeaGreen", "DarkSlateGrey", "Indigo", "LightSeaGreen", "LightSalmon", "maroon", "MediumVioletRed", "Chocolate", "CornflowerBlue", "Black", "Coral"];
  originalHours = 0;
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin]; // important!
  calendarWeekends = true;
  calendarEvents: EventInput[] = [];
  options: any;
  user = null;
  previousDate = null;
  toDate = new Date();
  toDateNgbDateStruct: NgbDateStruct = CommonLibrary.Date2NgbDateStruct(this.toDate);

  quota: QuotaDialogData = {
    id: "",
    quotaName: "",
    originalHours: 0,
    minutes: 0,
    remainingHours: 0,
    startDate: this.toDateNgbDateStruct,
    startTime: "00:00",
    endDate: this.toDateNgbDateStruct,
    endTime: "00:00",
    description: "",
    isNewEvent: true
  }

  static subscribeData: QuotaFromDBEntity[];
  static setSubscribeData(data: QuotaFromDBEntity[]) {
    QuotaCalendarComponent.subscribeData = data;
  }

  static subscribeQuotaFromDBEntity: QuotaFromDBEntity;
  static setSubscribeQuotaFromDBEntity(quota) {
    QuotaCalendarComponent.subscribeQuotaFromDBEntity = quota;
  }
  // Constructor - executes when component is created first
  constructor(public dialog: MatDialog,
    private quotaService: QuotaService,
    private toasterService: ToastrService,
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
    response.toPromise().then((data: QuotaFromDBEntity[]) => {
      QuotaCalendarComponent.setSubscribeData(data);
      let quotaList = QuotaCalendarComponent.subscribeData;
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
    });
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
    let quotaStartDate: NgbDateStruct = CommonLibrary.Date2NgbDateStruct(startDateTime);
    let endDateTime = new Date(quotaToEdit.endDateTime);
    let quotaEndDate: NgbDateStruct = CommonLibrary.Date2NgbDateStruct(endDateTime);

    this.quota.id = quotaToEdit.id;
    this.quota.quotaName = quotaToEdit.name,
      this.quota.originalHours = quotaToEdit.originalHours;
    this.quota.remainingHours = quotaToEdit.remainingHours;
    this.quota.startDate = quotaStartDate;
    this.quota.startTime = quotaToEdit.startDateTime.substr(11, 5);
    this.quota.endDate = quotaEndDate;
    this.quota.endTime = quotaToEdit.endDateTime.substr(11, 5);
    this.quota.description = quotaToEdit.description;
    this.quota.isNewEvent = false;
    this.originalHours = quotaToEdit.originalHours;
    this.getQuota(null);
    this.originalHours = 0;
  }

  // Get New Quota and set start date
  getQuota(startDate: NgbDateStruct): void {
    let dialogConfig = CommonLibrary.CreateDialog();
    dialogConfig.id = "quota-editor";
    dialogConfig.height = "60%";
    dialogConfig.data = { quota: this.quota };  // One way to pass data to modal window
    if (startDate != null) {
      dialogConfig.data.quota.startDate = startDate;
      if (CommonLibrary.NgbDateStruct2Date(startDate) > CommonLibrary.NgbDateStruct2Date(this.quota.endDate)) {
        dialogConfig.data.quota.endDate = startDate;
      }
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
    let userDetails: UserFromDBEntity = this.datastorageService.getUserEntity();
    let startDateTime = CommonLibrary.NgbDateStruct2DateTime(this.quota.startDate, this.quota.startTime);
    let endDateTime = CommonLibrary.NgbDateStruct2DateTime(this.quota.endDate, this.quota.endTime);

    let id, remainingHours;
    if (this.quota.id == "" && this.quota.isNewEvent) {
      id = CommonLibrary.GenerateUUID();
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
      originalHours: this.quota.originalHours + this.quota.minutes / 100,
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
    let response = this.quotaService.saveQuota(quotaEntity);
    let quota;
    response.toPromise().then((data: QuotaEntity) => {
      debugger;
      response.pipe(map((res: HttpResponse<any>) => {
         this.toasterService.success(
            "Status Code : " + res.status.toString(),
            " - " + res.statusText,
            { positionClass: 'toast-bottom-center' });
        }
      ));
      quota = data;
      if (quota == null || quota == undefined) { return; }
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
   });
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
    let quotaStartDate: NgbDateStruct = CommonLibrary.Date2NgbDateStruct(arg.date)
    this.getQuota(quotaStartDate);
  }
}
