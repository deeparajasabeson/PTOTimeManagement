import { Component, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder,  Validators, NgForm } from '@angular/forms';
import { NgbDateStruct, NgbCalendar, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { QuotaDialogData } from '../_models/QuotaDialogData';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-quota-editor',
  templateUrl: './quota-editor.component.html',
  styleUrls: ['./quota-editor.component.css']
})
export class QuotaEditorComponent implements OnInit {
  @Input() public quota: QuotaDialogData;  //Input from Calendar through @Input() property

  quotaeditorForm: FormGroup;
  private toDate = new Date();
  endDateRangeStartDate = new Date();

  startDateFilter = (date: Date): boolean => {
    return date > this.quota.endDate;
  }
  endDateFilter = (date: Date): boolean => {
    return date < this.quota.startDate || date < new Date();
  }

  constructor(
        private dialogRef: MatDialogRef<QuotaEditorComponent>,
        @Inject(MAT_DIALOG_DATA) dataFromCalendar: QuotaDialogData,   //data From Calendar
        private fb: FormBuilder,
        private calendar: NgbCalendar)   {  }

  ngOnInit() {
    this.quotaeditorForm = this.fb.group({
      quotaName: [this.quota.quotaName, Validators.maxLength(30)],
      hours: [this.quota.hours, Validators.required],
      startDate: [this.quota.startDate, Validators.required],
      startTime: [this.quota.startTime, [Validators.required, Validators.min(0.01), Validators.max(12.59)]],
      endDate: [this.quota.endDate, Validators.required],
      endTime: [this.quota.endTime, [Validators.required, Validators.min(0.01), Validators.max(12.59)]],
      description: [this.quota.description, Validators.maxLength(50)]
    });
    this.quotaeditorForm.controls.startDate.setValue({
      year: this.quota.startDate.getFullYear(),
      month: this.quota.startDate.getMonth(),
      day: this.quota.startDate.getDate()
    });
    this.quotaeditorForm.get('endDate').setValue({
      year: this.quota.endDate.getFullYear(),
      month: this.quota.endDate.getMonth(),
      day: this.quota.endDate.getDate(),
    });
  }

  startDate: NgbDateStruct;
  changeStartDateEvent(event) {
    this.startDate = event.next;
    this.quota.startDate = event.value;
  }

  changeEndDateEvent(event) {
    this.quota.endDate = event.value;
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}
