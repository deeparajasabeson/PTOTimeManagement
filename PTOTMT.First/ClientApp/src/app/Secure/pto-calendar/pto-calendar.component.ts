import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material';

import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';

import { PTODialogData } from '../../_viewmodels/PTODialogData';
import { FlexDialogData } from '../../_viewmodels/FlexDialogData';
import { QuotaEntity } from '../../_entities/QuotaEntity';
import { PTOEntity } from '../../_entities/PTOEntity';
import { StatusEntity } from '../../_entities/StatusEntity';
import { FlexEntity } from '../../_entities/FlexEntity';
import { FlexFromDBEntity } from '../../_entities/FlexFromDBEntity';
import { FlexTypeFromDBEntity } from '../../_entities/FlexTypeFromDBEntity';
import { UserFromDBEntity } from '../../_entities/UserFromDBEntity';
import { RequestTypeFromDBEntity } from '../../_entities/RequestTypeFromDBEntity';
import { PTOFromDBEntity } from '../../_entities/PTOFromDBEntity';
import { CommonLibrary } from '../../_library/common.library';
import { DataStorageService } from '../../_services/datastorage.service';
import { PTOEditorComponent } from '../pto-editor/pto-editor.component';
import { FlexEditorComponent } from '../flex-editor/flex-editor.component';
import { RequestTypeService } from '../../_services/requesttype.service';
import { PTOService } from '../../_services/pto.service';
import { FlexService } from '../../_services/flex.service';
import { FlexTypeService } from '../../_services/flextype.service';


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
  flexTypes: FlexTypeFromDBEntity[] = null;
  flexShiftSlide: FlexTypeFromDBEntity = null;
  flex: FlexDialogData;

  previousDate = null;
  toDate = new Date();
  toDateNgbDateStruct: NgbDateStruct = CommonLibrary.Date2NgbDateStruct(this.toDate);

  //Static Subscribe Variables and Functions
  static subscribeData: PTOFromDBEntity[];
  static setSubscribeData(data: PTOFromDBEntity[]) {
    PTOCalendarComponent.subscribeData = data;
  }
  
  static subscribePTOFromDBEntity: PTOFromDBEntity;
  static setSubscribePTOFromDBEntity(pto: PTOFromDBEntity) {
    PTOCalendarComponent.subscribePTOFromDBEntity = pto;
  }

  static subscribeFlexType: FlexTypeFromDBEntity;
  static setSubscribeFlexType(flexType: FlexTypeFromDBEntity) {
    PTOCalendarComponent.subscribeFlexType = flexType;
  }

  static subscribeFlexTypeFromDBEntity: FlexTypeFromDBEntity[];
  static setSubscribeFlexTypeFromDBEntity(flexTypes: FlexTypeFromDBEntity[]) {
    PTOCalendarComponent.subscribeFlexTypeFromDBEntity =flexTypes;
  }

  static subscribeFlex: FlexFromDBEntity;
  static setSubscribeFlex(flexs: FlexFromDBEntity) {
    PTOCalendarComponent.subscribeFlex = flexs;
  }

  static subscribeFlexFromDBEntity: FlexFromDBEntity[];
  static setSubscribeFlexFromDBEntity(flexs: FlexFromDBEntity[]) {
    PTOCalendarComponent.subscribeFlexFromDBEntity = flexs;
  }

  static subscribeRequestType: RequestTypeFromDBEntity;
  static setSubscribeRequestType(requestType: RequestTypeFromDBEntity) {
    PTOCalendarComponent.subscribeRequestType = requestType;
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
    private flexService: FlexService,
    private datastorageService: DataStorageService,
    private requestTypeService: RequestTypeService,
    private flexTypeService: FlexTypeService) { }

  // Execute after constructor when component is initialized
  ngOnInit() {
    this.options = {
      customButtons: {
        flex: {
          text: 'Schedule Flexibility',
          click: () => this.getScheduleFlex()
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
    this.InitializeDialogData();
    this.readRequestTypes();
    this.readPTObyUserId();
    this.readFlexTypes();
    this.readFlexbyUserId();
  }

  //Function to initialize Dialog Data
  InitializeDialogData() {
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
      quotaId: null,
      statusId: null,
      isNewEvent: true
    };

    this.flex = {
      id: "",
      userId: "",
      flexTypeId: "",
      flexTypes: [],
      flexTypeValue: "",
      name: "",
      description: "",
      hours: 2,
      minutes: 0,
      onDate: this.toDateNgbDateStruct,
      startTime: "00:00",
      endTime: "00:00",
      coWorkerId: "",
      anotherDate: null,
      coWorkerStartTime: "",
      coWorkerEndTime: "",
      isForward: true,
      isNewEvent: true
    };
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

  //ReadFlexType from DB
  readFlexTypes() {
    let response = this.flexTypeService.getFlexTypes();
    response.then((data: FlexTypeFromDBEntity[]) => {
      PTOCalendarComponent.setSubscribeFlexTypeFromDBEntity(data);
      this.flexTypes = [];
      data.forEach(val => this.flexTypes.push(Object.assign({}, val)));
      this.flex.flexTypes = [];
      this.flexTypes.forEach(val => this.flex.flexTypes.push(Object.assign({}, val)));
    });
    if (this.flexTypes == undefined || this.flexTypes.length == 0) {
      this.flexTypes = PTOCalendarComponent.subscribeFlexTypeFromDBEntity;
      let response = this.flexTypeService.getFlexTypeByName("Shift Slide");
      response.subscribe((data: FlexTypeFromDBEntity) => {
        PTOCalendarComponent.setSubscribeFlexType(data);
      });
      this.flexShiftSlide = PTOCalendarComponent.subscribeFlexType;
    }
    if ((this.flexShiftSlide == null || this.flexShiftSlide == undefined) && !(this.flexTypes == null || this.flexTypes == undefined)) {
    this.flexShiftSlide = this.flexTypes.find(ft => ft.name == "Shift Slide");
    }
    this.flex.flexTypeId = (this.flexShiftSlide != undefined && this.flexShiftSlide != null) ? this.flexShiftSlide.id : "";
  }

  //Read PTOs by Team Id
  readPTObyUserId() {
    let userId: string = this.datastorageService.getUserEntity().id;
    let response = this.ptoService.getPTOsByUserId(userId);
    response.then((data: PTOFromDBEntity[]) => {
      PTOCalendarComponent.setSubscribeData(data);
    });
    let ptoList = PTOCalendarComponent.subscribeData;
    if (ptoList == null || ptoList == undefined) {
      return
    }
    for (var i = 0; i < ptoList.length; ++i) {
      this.calendarEvents[i] =
      {
        allDay: (ptoList[i].hours == 8 && ptoList[i].startDateTime == ptoList[i].endDateTime),
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

  //Read Flexs by User Id
  readFlexbyUserId() {
    let userId: string = this.datastorageService.getUserEntity().id;
    let response = this.flexService.getFlexsByUserId(userId);
    response.then((data: FlexFromDBEntity[]) => {
      PTOCalendarComponent.setSubscribeFlexFromDBEntity(data);
    });
    let flexList = PTOCalendarComponent.subscribeFlexFromDBEntity;
    if (flexList == null || flexList == undefined) {
      return
    }
    var length = this.calendarEvents.length;
    for (var i = 0; i < flexList.length; ++i) {
      this.calendarEvents[length + i] =
      {
        allDay: false,
        backgroundColor: this.eventColor[Math.floor(Math.random() * (this.eventColor.length - 1 - 0) + 0)],
        textColor: "white",
        title: flexList[i].description,
        start: flexList[i].startDateTime,
        end: flexList[i].endDateTime,
        id: flexList[i].id,
        description: flexList[i].description,
        extendedProps: {
          name: flexList[i].name,
          hours: flexList[i].hours,
          userId: flexList[i].userId,
          flexTypeId: flexList[i].flexTypeId,
          isForward: flexList[i].isForward,
          coWorkerId: flexList[i].coWorkerId,
          anotherStartDateTime: flexList[i].anotherStartDateTime,
          anotherEndDateTime: flexList[i].anotherEndDateTime,
          isActive: flexList[i].isActive,
          createdBy: flexList[i].createdBy,
          createdOn: flexList[i].createdOn,
          updatedBy: flexList[i].updatedBy,
          updatedOn: flexList[i].updatedOn
        }
      };
    }
    if (this.flexTypes != undefined && this.flexTypes != null) {
      this.flex.flexTypes = this.flexTypes;
      this.flex.flexTypeId = this.flexTypes.find(ft => ft.name == "Shift Slide").id;
    }
    else {
      this.flex.flexTypes = [];
      this.flex.flexTypeId = "";
    }
  }

  //eventRender function from Calendar
  eventRender(info) {
    var attr_tooltip = document.createAttribute("data-tooltip");
    var attr_title = document.createAttribute("title");
    attr_tooltip.value = "";
    attr_title.value = info.event.extendedProps.description
      + "  Hours : " + info.event.extendedProps.name
      + "  Status : " + info.event.extendedProps.statusId;
    info.el.setAttributeNode(attr_tooltip);
    info.el.setAttributeNode(attr_title);
  }

  // Edit Quota when event is clicked
  handleEventClick(info) {
    let eventId = info.event.id;
    if (eventId == null) {
      return;
    }

    let response = this.ptoService.getPTOById(eventId);
    response.subscribe((data: PTOFromDBEntity) => {
      PTOCalendarComponent.setSubscribePTOFromDBEntity(data);
    });

    let ptoToEdit = PTOCalendarComponent.subscribePTOFromDBEntity;
    if (ptoToEdit == null || ptoToEdit == undefined) {
      this.handleFlexEventClick(eventId);  
      return;
    }

    //Clicked event is a PTO request
    let startDateTime = new Date(ptoToEdit.startDateTime);
    let ptoStartDate: NgbDateStruct = CommonLibrary.Date2NgbDateStruct(startDateTime);
    let endDateTime = new Date(ptoToEdit.endDateTime);
    let ptoEndDate: NgbDateStruct = CommonLibrary.Date2NgbDateStruct(endDateTime);

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
    this.pto.quotaId = ptoToEdit.quotaId;
    this.pto.statusId = ptoToEdit.statusId;
    this.pto.isNewEvent = false;
    this.getPTO(null);
  }

  //Search in Flex table and handle the clicked event
  handleFlexEventClick(eventId: string) {
    let response = this.flexService.getFlexById(eventId);
    response.subscribe((data: FlexFromDBEntity) => {
      PTOCalendarComponent.setSubscribeFlex(data);
    });

    let flexToEdit = PTOCalendarComponent.subscribeFlex;
    if (flexToEdit == null || flexToEdit == undefined) {
      return;
    }
    //Clicked event is a Flex request
    let startDateTime = new Date(flexToEdit.startDateTime);
    let flexStartDate: NgbDateStruct = CommonLibrary.Date2NgbDateStruct(startDateTime);
    let endDateTime = new Date(flexToEdit.endDateTime);
    let flexEndDate: NgbDateStruct = CommonLibrary.Date2NgbDateStruct(endDateTime);

    this.flex.id = flexToEdit.id;
    this.flex.userId = flexToEdit.userId;
    this.flex.description = flexToEdit.description;
    this.flex.flexTypes = PTOCalendarComponent.subscribeFlexTypeFromDBEntity;
    this.flex.flexTypeId = flexToEdit.flexTypeId,
      this.flex.hours = flexToEdit.hours;
    this.flex.onDate = flexStartDate;
    this.flex.startTime = flexToEdit.startDateTime.substr(11, 5);
    this.flex.anotherDate = flexEndDate;
    this.flex.endTime = flexToEdit.endDateTime.substr(11, 5);
    this.flex.isNewEvent = false;
    this.getScheduleFlex();
  }

  // Get New PTO and set start date
  getPTO(startDate: NgbDateStruct): void {
    let dialogConfig = CommonLibrary.CreateDialog();
    dialogConfig.id = "pto-editor";
    dialogConfig.height = "65%";
    dialogConfig.data = { pto: this.pto };  // One way to pass data to modal window

    if (startDate != null) {
      dialogConfig.data.pto.startDate = startDate;
      if (CommonLibrary.NgbDateStruct2Date(startDate) > CommonLibrary.NgbDateStruct2Date(this.pto.endDate)) {
        dialogConfig.data.pto.endDate = startDate;
      }
    }
    this.pto.requestTypeId = (this.requestFlexTime != undefined && this.requestFlexTime != null) ?
                                               this.requestFlexTime.id : "";
    const dialogRef = this.dialog.open(PTOEditorComponent, dialogConfig);
    dialogRef.componentInstance.pto = this.pto;  //another way to pass quota to modal window

    dialogRef.afterClosed().subscribe(resultData => {
      if (resultData != null && resultData != undefined) {
        this.pto = resultData;
        this.savePTO();
      }
    });
  }

  //Get New Schedule Flexibility
  getScheduleFlex(): void {
    let dialogConfig = CommonLibrary.CreateDialog();
    dialogConfig.id = "flex-editor";
    dialogConfig.height = "73%";
    dialogConfig.width = "95%";
    dialogConfig.data = { flex: this.flex };
    const dialogRef = this.dialog.open(FlexEditorComponent, dialogConfig);
    dialogRef.componentInstance.flex = this.flex;  //another way to pass quota to modal window

    dialogRef.afterClosed().subscribe(resultData => {
      if (resultData != null && resultData != undefined) {
        this.flex = resultData;
        this.saveFlex();
      }
    });
  }

  // Save PTO when clicked Save button in popup modal window
  savePTO() {
    let userDetails: UserFromDBEntity = this.datastorageService.getUserEntity();
    let startDateTime = CommonLibrary.NgbDateStruct2DateTime(this.pto.startDate, this.pto.startTime);
    let endDateTime = CommonLibrary.NgbDateStruct2DateTime(this.pto.endDate, this.pto.endTime);
    
    const ptoEntity: PTOEntity = {
      id: (this.pto.id == "" && this.pto.isNewEvent) ? CommonLibrary.GenerateUUID() : this.pto.id,
      userId: userDetails.id,
      description: this.pto.description,
      requestTypeId: this.pto.requestTypeId,
      hours: this.pto.hours + this.pto.minutes / 100,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      allDay: this.pto.allDay,
      statusId: this.pto.statusId,
      quotaId: this.pto.quotaId,
      isActive: true,
      createdBy: userDetails.id,
      createdOn: this.toDate,
      updatedBy: userDetails.id,
      updatedOn: this.toDate
    };
    let pto = this.ptoService.savePTO(ptoEntity);
    if (pto == null || pto == undefined) {
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

  //Save Schedule Flexibility when clicked Save button in popup modal window
  saveFlex() {
    let userDetails: UserFromDBEntity = this.datastorageService.getUserEntity();
    let startDateTime = CommonLibrary.NgbDateStruct2DateTime(this.flex.onDate, this.flex.startTime);
    let endDateTime = CommonLibrary.NgbDateStruct2DateTime(this.flex.onDate, this.flex.endTime);
    let anotherStartDateTime = CommonLibrary.NgbDateStruct2DateTime(this.flex.anotherDate, this.flex.coWorkerStartTime);
    let anotherEndDateTime = CommonLibrary.NgbDateStruct2DateTime(this.flex.anotherDate, this.flex.coWorkerEndTime);

    const flexEntity: FlexEntity = {
      id: (this.flex.id == "" && this.flex.isNewEvent) ? CommonLibrary.GenerateUUID() : this.flex.id,
      userId: userDetails.id,
      description: this.flex.description,
      name: this.flex.name,
      flexTypeId: this.flex.id,
      hours: this.flex.hours,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      isForward: this.flex.isForward,
      coWorkerId: this.flex.coWorkerId,
      anotherStartDateTime: anotherStartDateTime,
      anotherEndDateTime: anotherEndDateTime,
      isActive: true,
      createdBy: userDetails.id,
      createdOn: this.toDate,
      updatedBy: userDetails.id,
      updatedOn: this.toDate
    };
    let flex = this.flexService.saveFlex(flexEntity);
    if (flex == null || flex == undefined) {
      return;
    }

    this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
      title: flexEntity.description,
      start: startDateTime,
      end: endDateTime,
      id: flexEntity.id,
      allDay: false,
      color: this.eventColor[Math.floor(Math.random() * (this.eventColor.length - 1 - 0) + 0)],
      textColor: "white",
      description: flexEntity.description,
      extendedProps: {
        name: flexEntity.name,
        hours: flexEntity.hours,
        userId: flexEntity.userId,
        flexTypeId: flexEntity.flexTypeId,
        isForward: flexEntity.isForward,
        coWorkerId: flexEntity.coWorkerId,
        anotherStartDateTime: flexEntity.anotherStartDateTime,
        anotherEndDateTime: flexEntity.anotherEndDateTime,
        isActive: flexEntity.isActive,
        createdBy: flexEntity.createdBy,
        createdOn: flexEntity.createdOn,
        updatedBy: flexEntity.updatedBy,
        updatedOn: flexEntity.updatedOn
      }
    });
    let calendarApi = this.calendarComponent.getApi();
    if (calendarApi.needsRerender) {
      calendarApi.render();
    }
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
    let ptoStartDate: NgbDateStruct = CommonLibrary.Date2NgbDateStruct(arg.date)
    this.getPTO(ptoStartDate);
  }
}
