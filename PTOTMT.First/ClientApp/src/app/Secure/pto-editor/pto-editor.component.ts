import { Component, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder,  Validators, NgForm } from '@angular/forms';
import { NgbDateStruct, NgbDatepicker  } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material.module';

import { PTOService } from '../../_services/pto.service';
import { PTODialogData } from '../../_models/PTODialogData';
import { ValidateHours } from '../../_validators/ValidateHours';

@Component({
  selector: 'app-pto-editor',
  templateUrl: './pto-editor.component.html',
})
export class PTOEditorComponent implements OnInit {
  @ViewChild('dp', null) dp: NgbDatepicker;
  @Input() public pto: PTODialogData;  //Input from Calendar through @Input() property

  ptoeditorForm: FormGroup;
  private toDate = new Date();  //used in endDate filter in calendar template
  toDateNgbDateStruct: NgbDateStruct = {
    year: this.toDate.getFullYear(),
    month: this.toDate.getMonth(),
    day: this.toDate.getDate()
  }

  constructor(
        private dialogRef: MatDialogRef<PTOEditorComponent>,
        @Inject(MAT_DIALOG_DATA) dataFromCalendar: PTODialogData,   //data From Calendar
        private fb: FormBuilder,
        private ptoService: PTOService) { }

  ngOnInit() {
    this.ptoeditorForm = this.fb.group({
      id: [this.pto.id],
      userId: [this.pto.userId, Validators.required],
      location: ["", Validators.required],
      requestTypeId: [this.pto.requestTypeId, Validators.required],
      resourceTypes: [this.pto.requestTypes],
      description: [this.pto.description, Validators.maxLength(50)],
      hours: [this.pto.hours, [Validators.required,
                                              ValidateHours(this.pto.allDay, this.pto.startDate, this.pto.startTime, this.pto.endDate, this.pto.endTime)]],
      allDay: [this.pto.allDay, Validators.required ],
      startDate: [this.pto.startDate, Validators.required],
      startTime: [this.pto.startTime, [Validators.required, Validators.min(0.01), Validators.max(12.59)]],
      endDate: [this.pto.endDate, Validators.required],
      endTime: [this.pto.endTime, [Validators.required, Validators.min(0.01), Validators.max(12.59)]]
    });
  }

  onChange(isChecked: boolean) {
    if (isChecked) {
    }
    else {
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
