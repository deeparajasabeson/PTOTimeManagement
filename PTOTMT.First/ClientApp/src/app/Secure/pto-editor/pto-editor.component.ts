import { Component, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder,  Validators, NgForm } from '@angular/forms';
import { NgbDateStruct, NgbDatepicker  } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material.module';

import { PTOService } from '../../_services/pto.service';
import { PTODialogData } from '../../_models/PTODialogData';
import { ValidateHours } from '../../_validators/ValidateHours';
import { ValidateMinutes } from '../../_validators/ValidateMinutes';

@Component({
  selector: 'app-pto-editor',
  templateUrl: './pto-editor.component.html',
})
export class PTOEditorComponent implements OnInit {
  @ViewChild('dp', null) dp: NgbDatepicker;
  @Input() public pto: PTODialogData;  //Input from Calendar through @Input() property
  isNewEvent: boolean;

  ptoeditorForm: FormGroup;
  private toDate = new Date();  //used in endDate filter in calendar template
  toDateNgbDateStruct: NgbDateStruct = {
    year: this.toDate.getFullYear(),
    month: this.toDate.getMonth(),
    day: this.toDate.getDate()
  }

  constructor(
        private dialogRef: MatDialogRef<PTOEditorComponent>,
        @Inject(MAT_DIALOG_DATA) public dataDialog: PTODialogData,   //data From Calendar
        private fb: FormBuilder,
        private ptoService: PTOService) { }

  ngOnInit() {
    this.isNewEvent = true;
    //this.isNewEvent = this.dataDialog.isNewEvent;
    //this.isNewEvent = this.pto.isNewEvent;
    this.ptoeditorForm = this.fb.group({
      id: [this.pto.id],
      userId: [this.pto.userId, Validators.required],
      location: ["", Validators.required],
      requestTypeId: [this.pto.requestTypeId, Validators.required],
      resourceTypes: [this.pto.requestTypes],
      description: [this.pto.description, Validators.maxLength(50)],
      hours: [this.pto.hours, [Validators.required,
        ValidateHours(this.pto.allDay, this.pto.startDate, this.pto.startTime, this.pto.endDate, this.pto.endTime)]],
      minutes: [this.pto.hours - Math.floor(this.pto.hours),  ValidateMinutes],
      allDay: [this.pto.allDay, Validators.required ],
      startDate: [this.pto.startDate, Validators.required],
      startTime: [this.pto.startTime, [Validators.required, Validators.min(0.01), Validators.max(12.59)]],
      endDate: [this.pto.endDate, Validators.required],
      endTime: [this.pto.endTime, [Validators.required, Validators.min(0.01), Validators.max(12.59)]]
    });
    this.onChanges();
  }

  onChanges() {
    this.ptoeditorForm.get('allDay').valueChanges
      .subscribe(allDay => {
        if (allDay) {
          this.ptoeditorForm.get('startTime').disable();
          this.ptoeditorForm.get('endTime').disable();
        }
        else {
          this.ptoeditorForm.get('startTime').enable();
          this.ptoeditorForm.get('endTime').enable();
        }
      });
  }

  onAllDayChanges(isAllDay: boolean) {
    if (isAllDay) {
      this.ptoeditorForm.get('startTime').disable();
      this.ptoeditorForm.get('endTime').disable();
    }
    else {
      this.ptoeditorForm.get('startTime').enable();
      this.ptoeditorForm.get('endTime').enable();
    }
  }
  navigateEvent(event) {
    this.pto.startDate = event.next;
  }

  savePTO(ptoForm: NgForm): void {  //quotaForm also has the form value as thisquotaeditorForm.value
    this.dialogRef.close(this.ptoeditorForm.value);
    if (this.ptoeditorForm.valid) {
      this.pto = this.ptoeditorForm.value;
    }
  }

  deletePTO(ptoForm: NgForm): void {
    this.dialogRef.close();
    this.pto = this.ptoeditorForm.value;
    if (confirm("Want to delete request -- " + this.pto.description + " ?")) {
      this.ptoService.deletePTO(this.pto.id);
    }
  }

  onNoClick(event: any): void {
    event.stopPropogation();
    this.dialogRef.close();
    this.pto = null;
  }
}
