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
  @Input() public isLeadership: boolean;

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
      id: [{ value: this.quota.id, disabled: !this.isLeadership }],
      quotaName: [{ value: this.quota.quotaName, disabled: !this.isLeadership }, Validators.maxLength(30)],
      teamId: [{
        value: (this.quota.teamId.length == 0) ? this.quota.teams[0].id : this.quota.teamId, disabled: !this.isLeadership
      }, Validators.required],
      originalHours: [{ value: Math.floor(this.quota.originalHours), disabled: !this.isLeadership }, [Validators.required, Validators.min(0)]],
      minutes: [{ value: (this.quota.originalHours - Math.floor(this.quota.originalHours)) * 100, disabled: !this.isLeadership }, [Validators.min(0), Validators.max(30), ValidateMinutes]],
      remainingHours: [{ value: this.quota.remainingHours, disabled: !this.isLeadership }],
      startDate: [{ value: this.quota.startDate, disabled: !this.isLeadership }, Validators.required],
      startTime: [{ value: this.quota.startTime, disabled: !this.isLeadership }, [Validators.required, Validators.min(0.01), Validators.max(24)]],
      endDate: [{ value: this.quota.endDate, disabled: !this.isLeadership }, Validators.required],
      endTime: [{ value: this.quota.endTime, disabled: !this.isLeadership }, [Validators.required, Validators.min(0.01), Validators.max(24)]],
      description: [{ value: this.quota.description, disabled: !this.isLeadership }, Validators.maxLength(50)],
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
