import { Component, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder,  Validators, NgForm } from '@angular/forms';
import { NgbDateStruct, NgbDatepicker  } from '@ng-bootstrap/ng-bootstrap';
import { QuotaDialogData } from '../../_models/QuotaDialogData';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-quota-editor',
  templateUrl: './quota-editor.component.html',
  styleUrls: ['./quota-editor.component.css']
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
        private fb: FormBuilder)   {  }

  ngOnInit() {
    this.quotaeditorForm = this.fb.group({
      id: [this.quota.id],
      quotaName: [this.quota.quotaName, Validators.maxLength(30)],
      originalHours: [this.quota.originalHours, [Validators.required, Validators.min(this.quota.remainingHours)]],
      remainingHours: [this.quota.remainingHours],
      startDate: [this.quota.startDate, Validators.required],
      startTime: [this.quota.startTime, [Validators.required, Validators.min(0.01), Validators.max(12.59)]],
      endDate: [this.quota.endDate, Validators.required],
      endTime: [this.quota.endTime, [Validators.required, Validators.min(0.01), Validators.max(12.59)]],
      description: [this.quota.description, Validators.maxLength(50)]
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

  onNoClick(event: any): void {
    event.stopPropogation();
    this.dialogRef.close();
    this.quota = null;
  }
}
