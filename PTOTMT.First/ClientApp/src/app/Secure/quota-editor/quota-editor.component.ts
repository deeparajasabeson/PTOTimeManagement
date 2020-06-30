import { Component, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder,  Validators, NgForm } from '@angular/forms';
import { NgbDateStruct, NgbDatepicker  } from '@ng-bootstrap/ng-bootstrap';
import { QuotaDialogData } from '../../_viewmodels/QuotaDialogData';
import { MaterialModule } from '../material.module';
import { QuotaCustomValidators } from '../../_validators/QuotaCustomValidators.Validator';
import { QuotaService } from '../../_services/quota.service';
import { ValidateMinutes } from '../../_validators/ValidateMinutes';

@Component({
  selector:'app-quota-editor',
  templateUrl: './quota-editor.component.html'
})
export class QuotaEditorComponent implements OnInit {
  @ViewChild('dp', null) dp: NgbDatepicker;
  @Input() public quota: QuotaDialogData;  //Input from Calendar through @Input() property
  quotaeditorForm: FormGroup;
  private toDate = new Date();  //used in endDate filter in calendar template

  toDateNgbDateStruct: NgbDateStruct = {
    year: this.toDate.getFullYear(),
    month: this.toDate.getMonth(),
    day: this.toDate.getDate()
  }

  constructor(
        private dialogRef: MatDialogRef<QuotaEditorComponent>,
        @Inject(MAT_DIALOG_DATA) dataFromCalendar: QuotaDialogData,   //data From Calendar
        private fb: FormBuilder,
        private quotaService: QuotaService) { }

  ngOnInit() {
    this.quotaeditorForm = this.fb.group({
      id: [this.quota.id],
      quotaName: [this.quota.quotaName, Validators.maxLength(30)],
      originalHours: [Math.floor(this.quota.originalHours), [Validators.required, Validators.min(0)]],
      minutes: [(this.quota.originalHours - Math.floor(this.quota.originalHours)) * 100, [Validators.min(0), Validators.max(30), ValidateMinutes]],
      remainingHours: [this.quota.remainingHours],
      startDate: [this.quota.startDate, Validators.required],
      startTime: [this.quota.startTime, [Validators.required, Validators.min(0.01), Validators.max(24)]],
      endDate: [this.quota.endDate, Validators.required],
      endTime: [this.quota.endTime, [Validators.required, Validators.min(0.01), Validators.max(24)]],
      description: [this.quota.description, Validators.maxLength(50)],
      isNewEvent: [this.quota.isNewEvent]
    }, {
      validator: QuotaCustomValidators.ValidateOriginalHours()
    });
  }

  navigateEvent(event) {
    this.quota.startDate = event.next;
  }

  saveQuota(quotaForm: NgForm): void {  //quotaForm also has the form value as thisquotaeditorForm.value
    this.dialogRef.close(this.quotaeditorForm.value);
    if (this.quotaeditorForm.valid) {
      this.quota = this.quotaeditorForm.value;
    }
  }

  deleteQuota(quotaForm: NgForm): void {
    this.dialogRef.close();
    this.quota = this.quotaeditorForm.value;
    if (confirm("Want to delete event -- " + this.quota.quotaName + " ?")) {
      this.quotaService.deleteQuota(this.quota.id);
    }
  }

  onNoClick(event: any): void {
    this.dialogRef.close();
    this.quota = null;
  }
}
