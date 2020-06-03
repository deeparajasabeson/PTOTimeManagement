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
import { PTOService } from '../../_services/pto.service';
import { StatusService } from '../../_services/status.service';
import { DataStorageService } from '../../_services/datastorage.service';
import { UserEntity } from '../../_entities/UserEntity';


@Component({
  selector: 'app-pto-calendar',
  templateUrl: './pto-calendar.component.html'
})
export class PTOCalendarComponent implements OnInit {
  // references the #calendar in the template
  @ViewChild('calendar', null) calendarComponent: FullCalendarComponent; // the #calendar in the template
  eventColor: string[] = ["red", "green", "blue", "brown", "BlueViolet", "gray", "cyan", "CadetBlue", "DarkGoldenRod", "DarkKhaki", "DarkGreen", "DarkRed", "DarkOrange", "DarkSeaGreen", "DarkSlateGrey", "Indigo", "LightSeaGreen", "LightSalmon", "maroon", "MediumVioletRed", "Chocolate", "CornflowerBlue", "Black", "Coral"];
  isNewEvent = true;
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin]; // important!
  calendarWeekends = true;
  calendarEvents: EventInput[] = [];
  options: any;
  user = null;
  previousDate = null;
  toDate = new Date();
  toDateNgbDateStruct: NgbDateStruct = {
    year: this.toDate.getFullYear(),
    month: this.toDate.getMonth() + 1,
    day: this.toDate.getDate()
  }

  pto: PTODialogData = {
    id: "",
    userId: "",
    requestTypeId: "",
    description: "",
    hours: 0,
    allDay: false,
    startDate: this.toDateNgbDateStruct,
    startTime: "00:00",
    endDate: this.toDateNgbDateStruct,
    endTime: "00:00"
  }
  static subscribeData: any;
  static setSubscribeData(data): any {
    PTOCalendarComponent.subscribeData = data;
    return data;
  }

  static subscribePTOFromDBEntity: PTOFromDBEntity;
  static setSubscribePTOFromDBEntity(pto): PTOFromDBEntity {
    PTOCalendarComponent.subscribePTOFromDBEntity = pto;
    return pto;
  }

  // Constructor - executes when component is created first
  constructor(public dialog: MatDialog,
    private ptoService: PTOService,
    private statusService: StatusService,
    private datastorageService: DataStorageService) { }

  // Execute after constructor when component is initialized
  ngOnInit() {
    this.options = {
      customButtons: {
        newpto: {
          text: 'Schedule Flexibility',
          click: () => this.getPTO(null)    // click: this.getPTO(null).bind(this) // <-------- CAN ALSO USE THIS ONE
        }
      },
      header: {
        left: 'prev,next today newquota',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }
    };
    this.readPTObyUserId();
  }

  //Read Quotas by Team Id
  readPTObyUserId() {
    let userId: string = this.datastorageService.getUserEntity().id;
    let response = this.ptoService.getPTOsByUserId(userId);
    response.subscribe((data: PTOFromDBEntity[]) => {
      PTOCalendarComponent.setSubscribeData(data);
    });

    let ptoList = PTOCalendarComponent.subscribeData;
    if (ptoList == null) {
      return
    }
    for (var i = 0; i < ptoList.length; ++i) {
      this.calendarEvents[i] =
      {
        allDay: false,
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
          statusId: ptoList[i].statusId,
          isActive: ptoList[i].isActive,
          createdBy: ptoList[i].createdBy,
          createdOn: ptoList[i].createdOn,
          updatedBy: ptoList[i].updatedBy,
          updatedOn: ptoList[i].updatedOn
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
    this.pto.description = ptoToEdit.description,
      this.pto.hours = ptoToEdit.hours;
    this.pto.startDate = ptoStartDate;
    this.pto.startTime = ptoToEdit.startDateTime.substr(11, 5);
    this.pto.endDate = ptoEndDate;
    this.pto.endTime = ptoToEdit.endDateTime.substr(11, 5);
    this.isNewEvent = false;
    this.getPTO(null);
    this.isNewEvent = true;
  }

  // Get New PTO and set start date
  getPTO(startDate: Date): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;   // User can't close the dialog by clicking outside its body
    dialogConfig.autoFocus = true;
    dialogConfig.id = "pto-editor";
    dialogConfig.height = "60%";
    dialogConfig.width = "70%";
    dialogConfig.data = { pto: this.pto, teamId: this.datastorageService.getUserEntity().teamFunctionId };  // One way to pass data to modal window
    if (startDate != null) {
      dialogConfig.data.pto.startDate = startDate;
    }
    const dialogRef = this.dialog.open(PTOEditorComponent, dialogConfig);
    dialogRef.componentInstance.pto = this.pto;  //another way to pass quota to modal window
    dialogRef.componentInstance.teamId = this.datastorageService.getUserEntity().teamFunctionId;

    dialogRef.afterClosed().subscribe(resultData => {
      if (resultData != null && resultData != undefined) {
        this.pto = resultData;
        this.savePTO();
      }
    });
  }

  // Save PTO
  savePTO() {
    let userDetails: UserEntity = this.datastorageService.getUserEntity();
    let waitListStatus: StatusEntity;

    let startDateTime = new Date(
      this.pto.startDate.year,
      this.pto.startDate.month,
      this.pto.startDate.day,
      parseInt(this.pto.startTime.substr(0, 2)),
      parseInt(this.pto.startTime.substr(3, 2)));

    let endDateTime = new Date(
      this.pto.endDate.year,
      this.pto.endDate.month,
      this.pto.endDate.day,
      parseInt(this.pto.endTime.substr(0, 2)),
      parseInt(this.pto.endTime.substr(3, 2)));
        
    const ptoEntity: PTOEntity = {
      id: (this.pto.id == "" && this.isNewEvent) ? this.generateUUID() : this.pto.id,
      userId: userDetails.id,
      description: this.pto.description,
      hours: this.pto.hours,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      statusId: waitListStatus.id,
      quotaId: "",
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
