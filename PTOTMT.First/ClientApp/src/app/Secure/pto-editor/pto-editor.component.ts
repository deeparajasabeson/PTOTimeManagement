import { Component, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder,  Validators, NgForm } from '@angular/forms';
import { NgbDateStruct, NgbDatepicker  } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material.module';

import { PTODialogData } from '../../_viewmodels/PTODialogData';
import { RequestTypeFromDBEntity } from '../../_entities/RequestTypeFromDBEntity';
import { PTOService } from '../../_services/pto.service';
import { PTOCustomValidators } from '../../_validators/PTOCustomValidators.Validator';
import { ValidateMinutes } from '../../_validators/ValidateMinutes';


@Component({
  selector:'app-pto-editor',
  templateUrl: './pto-editor.component.html',
})
export class PTOEditorComponent implements OnInit {
  @ViewChild('dp', null) dp: NgbDatepicker;
  @Input() public pto: PTODialogData;  //Input from Calendar through @Input() property
  requestTypes: RequestTypeFromDBEntity[];

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
    if (this.pto.requestTypeId == "" && this.pto.requestTypes.length > 0) {
      this.pto.requestTypeId = this.pto.requestTypes.find(rt => rt.name == "Flex Time").id;
    }
    this.ptoeditorForm = this.fb.group({
      id: [this.pto.id],
      userId: [this.pto.userId],
      requestTypeId: [this.pto.requestTypeId, Validators.required],
      description: [this.pto.description, Validators.maxLength(50)],
      hours: [Math.floor(this.pto.hours), [Validators.required, Validators.min(0)]],
      minutes: [(this.pto.hours - Math.floor(this.pto.hours))*100,  [Validators.min(0), Validators.max(30), ValidateMinutes]],
      allDay: [this.pto.allDay],
      startDate: [this.pto.startDate, Validators.required],
      startTime: [this.pto.startTime],
      endDate: [this.pto.endDate, Validators.required],
      endTime: [this.pto.endTime],
      quotaId: [this.pto.quotaId],
      statusId: [this.pto.statusId],
      isNewEvent: [this.pto.isNewEvent]
    }, {
        validator: PTOCustomValidators.ValidateHours()
    });
    this.requestTypes = [];
    this.pto.requestTypes.forEach(val => this.requestTypes.push(Object.assign({}, val)));

    this.onChanges();
  }

  onChanges() {
    this.ptoeditorForm.get('allDay').valueChanges
      .subscribe(allDay => {
        this.onAllDayChanges(allDay);
      });
  }

  onAllDayChanges(isAllDay: boolean) {
    if (isAllDay) {
      this.ptoeditorForm.get('startTime').disable();
      this.ptoeditorForm.get('endTime').disable();
      this.ptoeditorForm.get('hours').setValue(8);
      this.ptoeditorForm.get('minutes').setValue(0);
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
    if (this.ptoeditorForm.valid) {
      this.dialogRef.close(this.ptoeditorForm.value);
      if (this.ptoeditorForm.valid) {
        this.pto = this.ptoeditorForm.value;
      }
    }
  }

  deletePTO(ptoForm: NgForm): void {
    this.dialogRef.close();
    this.pto = this.ptoeditorForm.value;
    if (confirm("Want to delete this request -- " + this.pto.description + " ?")) {
      this.ptoService.deletePTO(this.pto.id);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.pto = null;
  }
}
