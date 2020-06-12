import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogConfig } from '@angular/material/dialog';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { PTOEditorComponent } from '../pto-editor/pto-editor.component';
import { PTODialogData } from '../../_models/PTODialogData';
import { PTOEntity } from '../../_entities/PTOEntity';
import { StatusEntity } from '../../_entities/StatusEntity';
import { PTOFromDBEntity } from '../../_entities/PTOFromDBEntity';
import { RequestTypeFromDBEntity } from '../../_entities/RequestTypeFromDBEntity';
import { PTOService } from '../../_services/pto.service';
import { StatusService } from '../../_services/status.service';
import { DataStorageService } from '../../_services/datastorage.service';
import { RequestTypeService } from '../../_services/requesttype.service';
import { UserEntity } from '../../_entities/UserEntity';
import { QuotaService } from '../../_services/quota.service';
import { FindQuotaEntity } from '../../_entities/FindQuotaEntity';
import { QuotaEntity } from '../../_entities/QuotaEntity';

@Component({
  selector: 'app-pto-calendar',
  templateUrl: './pto-calendar.component.html'
})
export class PTOCalendarComponent implements OnInit {
  // references the #calendar in the template
  @ViewChild('calendar', null) calendarComponent: FullCalendarComponent; 
  eventColor: string[] = ["red", "green", "blue", "brown", "BlueViolet", "gray", "cyan", "CadetBlue", "DarkGoldenRod", "DarkKhaki", "DarkGreen", "DarkRed", "DarkOrange", "DarkSeaGreen", "DarkSlateGrey", "Indigo", "LightSeaGreen", "LightSalmon", "maroon", "MediumVioletRed", "Chocolate", "CornflowerBlue", "Black", "Coral"];
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[] = [];
  options: any;
  user = null;

  requestTypes: RequestTypeFromDBEntity[] = null;
  requestFlexTime: RequestTypeFromDBEntity = null;
  pto: PTODialogData;

  previousDate = null;
  toDate = new Date();
  toDateNgbDateStruct: NgbDateStruct = {
    year: this.toDate.getFullYear(),
    month: this.toDate.getMonth() + 1,
    day: this.toDate.getDate()
  }
  
  static subscribeData: any;
  static setSubscribeData(data): any {
    PTOCalendarComponent.subscribeData = data;
    return data;
  }

  static subscribePTOFromDBEntity: any;
  static setSubscribePTOFromDBEntity(pto) {
    PTOCalendarComponent.subscribePTOFromDBEntity = pto;
  }

  static subscribeRequestType: RequestTypeFromDBEntity;
  static setSubscribeRequestType(requestType: RequestTypeFromDBEntity) {
    PTOCalendarComponent.subscribePTOFromDBEntity = requestType;
  }

  static subscribeRequestTypeFromDBEntity: RequestTypeFromDBEntity[];
  static setSubscribeRequestTypeFromDBEntity(requestTypes: RequestTypeFromDBEntity[]) {
    PTOCalendarComponent.subscribeRequestTypeFromDBEntity = requestTypes;
  }

  static subscribeQuotaData: QuotaEntity;
  static setSubscribeQuotaData(quota: QuotaEntity) {
    PTOCalendarComponent.subscribeQuotaData = quota;
  }

  static subscribeStatusData: StatusEntity[];
  static setSubscribeStatusData(statuses: StatusEntity[]) {
    PTOCalendarComponent.subscribeStatusData = statuses;
  }

  // Constructor - executes when component is created first
  constructor(public dialog: MatDialog,
    private ptoService: PTOService,
    private quotaService: QuotaService,
    private statusService: StatusService,
    private datastorageService: DataStorageService,
    private requestTypeService: RequestTypeService) {  }

  // Execute after constructor when component is initialized
  ngOnInit() {
    this.options = {
      customButtons: {
        flex: {
          text: 'Schedule Flexibility',
          click: () => this.scheduleFlex()
        },
        newpto: {
          text: 'New PTO Request',
          click: () => this.getPTO(null)    // click: this.getPTO(null).bind(this)//<-- CAN ALSO USE THIS ONE
        }
      },
      header: {
        left: 'prev,next today newpto flex',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }
    };

    this.pto = {
      id: "",
      userId: "",
      requestTypeId: "",
      requestTypes: [],
      description: "",
      hours: 8,
      minutes: 0,
      allDay: true,
      startDate: this.toDateNgbDateStruct,
      startTime: "00:00",
      endDate: this.toDateNgbDateStruct,
      endTime: "00:00",
      isNewEvent: true,
      quotaId: null,
      statusId: null
    };

    this.readRequestTypes();
    this.readPTObyUserId();
  }

  //Read RequestType from DB
  readRequestTypes() {
    let response = this.requestTypeService.getRequestTypes();
    response.then((data: RequestTypeFromDBEntity[]) => {
      PTOCalendarComponent.setSubscribeRequestTypeFromDBEntity(data);
      this.requestTypes = [];
      data.forEach(val => this.requestTypes.push(Object.assign({}, val)));
      this.pto.requestTypes = [];
      this.requestTypes.forEach(val => this.pto.requestTypes.push(Object.assign({}, val)));
    });

    if (this.requestTypes == undefined || this.requestTypes.length == 0) {
      this.requestTypes = PTOCalendarComponent.subscribeRequestTypeFromDBEntity;
      let response = this.requestTypeService.getRequestTypeByName("Flex Time");
      response.subscribe((data: RequestTypeFromDBEntity) => {
              PTOCalendarComponent.setSubscribeRequestType(data);
      });
      this.requestFlexTime = PTOCalendarComponent.subscribeRequestType;
    }
    else {
      this.requestFlexTime = this.requestTypes.find(rt => rt.name == "Flex Time");
    }
    this.pto.requestTypeId = (this.requestFlexTime != undefined && this.requestFlexTime != null) ? this.requestFlexTime.id : "";
  }

  //Read Quotas by Team Id
  readPTObyUserId() {
    let userId: string = this.datastorageService.getUserEntity().id;
    let response = this.ptoService.getPTOsByUserId(userId);
    response.then((data: PTOFromDBEntity[]) => {
      PTOCalendarComponent.setSubscribeData(data);
    });
    let ptoList = PTOCalendarComponent.subscribeData;
    if (ptoList == null) {
      return
    }
    for (var i = 0; i < ptoList.length; ++i) {
      this.calendarEvents[i] =
      {
        allDay: ptoList[i].allDay,
        backgroundColor: this.eventColor[Math.floor(Math.random() * (this.eventColor.length - 1 - 0) + 0)],
        textColor: "white",
        title: ptoList[i].description,
        start: ptoList[i].startDateTime,
        end: ptoList[i].endDateTime,
        id: ptoList[i].id,
        extendedProps: {
          hours: ptoList[i].hours,
          userId: ptoList[i].userId,
          requestTypeId: ptoList[i].requestTypeId,
          quotaId:ptoList[i].quotaId,
          statusId: ptoList[i].statusId,
          isActive: ptoList[i].isActive,
          createdBy: ptoList[i].createdBy,
          createdOn: ptoList[i].createdOn,
          updatedBy: ptoList[i].updatedBy,
          updatedOn: ptoList[i].updatedOn
        }
      };
    }
    if (this.requestTypes != undefined && this.requestTypes != null) {
      this.pto.requestTypes = this.requestTypes;
      this.pto.requestTypeId =  this.requestTypes.find(rt => rt.name == "Flex Time").id;
    }
    else {
      this.pto.requestTypes = [];
      this.pto.requestTypeId = "";
    }
  }

  //eventRender function from Calendar
  eventRender(info) {
    var attr_tooltip = document.createAttribute("data-tooltip");
    var attr_title = document.createAttribute("title");
    attr_tooltip.value = "";
    attr_title.value = info.event.extendedProps.description
      + "  PTO Hours : " + info.event.extendedProps.hours
      + "  Status : " + info.event.extendedProps.statusId;
    info.el.setAttributeNode(attr_tooltip);
    info.el.setAttributeNode(attr_title);
  }

  // Edit Quota when event is clicked
  handleEventClick(info) {
    let ptoId = info.event.id;
    if (ptoId == null) {
      return;
    }

    let response = this.ptoService.getPTOById(ptoId);
    response.subscribe((data: PTOFromDBEntity) => {
      PTOCalendarComponent.setSubscribePTOFromDBEntity(data);
    });

    let ptoToEdit = PTOCalendarComponent.subscribePTOFromDBEntity;
    if (ptoToEdit == null) {
      return
    }

    let startDateTime = new Date(ptoToEdit.startDateTime);
    let ptoStartDate: NgbDateStruct = {
      year: startDateTime.getFullYear(),
      month: startDateTime.getMonth() + 1,
      day: startDateTime.getDate()
    }

    let endDateTime = new Date(ptoToEdit.endDateTime);
    let ptoEndDate: NgbDateStruct = {
      year: endDateTime.getFullYear(),
      month: endDateTime.getMonth() + 1,
      day: endDateTime.getDate()
    }

    this.pto.id = ptoToEdit.id;
    this.pto.userId = ptoToEdit.userId;
    this.pto.description = ptoToEdit.description;
    this.pto.requestTypes = PTOCalendarComponent.subscribeRequestTypeFromDBEntity;
   this.pto.requestTypeId = ptoToEdit.requestTypeId,
    this.pto.hours = ptoToEdit.hours;
    this.pto.startDate = ptoStartDate;
    this.pto.startTime = ptoToEdit.startDateTime.substr(11, 5);
    this.pto.endDate = ptoEndDate;
    this.pto.endTime = ptoToEdit.endDateTime.substr(11, 5);
    this.pto.isNewEvent = false;
    this.pto.quotaId = ptoToEdit.quotaId;
    this.pto.statusId = ptoToEdit.statusId;
    this.getPTO(null);
  }

  //
  scheduleFlex(): void { }

  // Get New PTO and set start date
  getPTO(startDate: Date): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;   // User can't close the dialog by clicking outside its body
    dialogConfig.autoFocus = true;
    dialogConfig.id = "pto-editor";
    dialogConfig.height = "65%";
    dialogConfig.width = "70%";
    dialogConfig.data = { pto: this.pto };  // One way to pass data to modal window
    if (startDate != null) {
      dialogConfig.data.pto.startDate = startDate;
    }

    this.pto.requestTypeId = (this.requestFlexTime != undefined && this.requestFlexTime != null) ? this.requestFlexTime.id : "";

    const dialogRef = this.dialog.open(PTOEditorComponent, dialogConfig);
    let instance = dialogRef.componentInstance;
    instance.pto = this.pto;  //another way to pass quota to modal window

    dialogRef.afterClosed().subscribe(resultData => {
      if (resultData != null && resultData != undefined) {
        this.pto = resultData;
        this.savePTO();
      }
    });
  }

  //Function to convert Date Struct and Time String into a valid Date
  toDateTime(date: NgbDateStruct, time: string): Date {
    return new Date(
      date.year,
      date.month,
      date.day,
      parseInt(time.substr(0, 2)),
      parseInt(time.substr(3, 2)));
  }

  // Save PTO when clicked Save button in popup modal window
  savePTO() {
    let userDetails: UserEntity = this.datastorageService.getUserEntity();

    //Status Service
    //let statuses: StatusEntity[] 
    //this.statusService.getStatuses()
    //  .toPromise()
    //  .then((statusData: StatusEntity[]) => {
    //    PTOCalendarComponent.setSubscribeStatusData(statusData);
    //  });
    //statuses = PTOCalendarComponent.subscribeStatusData;
    //let waitListStatus: StatusEntity = statuses.find(s => s.name == "WaitList");
    //let approvedStatus: StatusEntity = statuses.find(s => s.name == "Approved");

    let startDateTime = this.toDateTime(this.pto.startDate, this.pto.startTime);
    let endDateTime = this.toDateTime(this.pto.endDate, this.pto.endTime);

    //let quota = this.findQuota();
    
    const ptoEntity: PTOEntity = {
      id: (this.pto.id == "" && this.pto.isNewEvent) ? this.generateUUID() : this.pto.id,
      userId: userDetails.id,
      description: this.pto.description,
      requestTypeId: this.pto.requestTypeId,
      hours: this.pto.hours + this.pto.minutes / 100,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      allDay: this.pto.allDay,
      statusId: this.pto.statusId,
      quotaId: this.pto.quotaId,
      //statusId: (quota == null) ? waitListStatus.id : approvedStatus.id,
      //quotaId: (quota ==null) ? "" : quota.id,
      isActive: true,
      createdBy: userDetails.id,
      createdOn: this.toDate,
      updatedBy: userDetails.id,
      updatedOn: this.toDate
    };
    let pto = this.ptoService.savePTO(ptoEntity);
    if (pto == null) {
      return;
    }

    this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
      title: ptoEntity.description,
      start: startDateTime,
      end: endDateTime,
      id: ptoEntity.id,
      allDay: ptoEntity.allDay,
      color: this.eventColor[Math.floor(Math.random() * (this.eventColor.length - 1 - 0) + 0)],
      textColor: "white"
    })
    let calendarApi = this.calendarComponent.getApi();
    if (calendarApi.needsRerender) {
      calendarApi.render();
    }
  }

  ////Find Quota for this request to allot
  //findQuota(): QuotaEntity {
  //  let entity: FindQuotaEntity;
  //  entity.ptoId = this.pto.id;
  //  entity.startDateTime = this.toDateTime(this.pto.startDate, this.pto.startTime);
  //  entity.endDateTime = this.toDateTime(this.pto.endDate, this.pto.endTime);
  //  entity.hours = this.pto.hours + this.pto.minutes / 100;
  //  let response = this.quotaService.findQuota(entity);
  //  let quotaToAllot: QuotaEntity;
  //  response.then((quota: QuotaEntity) => {
  //    console.log(quota); 
  //    PTOCalendarComponent.setSubscribeQuotaData(quota);
  //  });
  //  quotaToAllot = PTOCalendarComponent.subscribeQuotaData;
  //  return quotaToAllot;
  //}

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
    return (token) ? true : false;
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
    this.getPTO(arg.date);
  }
}
