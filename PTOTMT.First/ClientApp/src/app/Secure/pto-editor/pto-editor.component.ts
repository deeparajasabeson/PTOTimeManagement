import { Component, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder,  Validators, NgForm, AbstractControl } from '@angular/forms';
import { NgbDateStruct, NgbDatepicker  } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material.module';

import { TeamService } from '../../_services/team.service';
import { DataStorageService } from '../../_services/datastorage.service';
import { PTODialogData } from '../../_models/PTODialogData';
import { TeamFromDBEntity } from '../../_entities/TeamFromDBEntity';
import { ValidateHours } from '../../_validators/ValidateHours';
import { UserEntity } from '../../_entities/UserEntity';

@Component({
  selector: 'app-pto-editor',
  templateUrl: './pto-editor.component.html',
})
export class PTOEditorComponent implements OnInit {
  @ViewChild('dp', null) dp: NgbDatepicker;
  @Input() public pto: PTODialogData;  //Input from Calendar through @Input() property
  @Input() public teamId: string;

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
        private teamService: TeamService,
        private datastorageService: DataStorageService) { }

  ngOnInit() {
    let user: UserEntity = this.datastorageService.getUserEntity();
    let team: TeamFromDBEntity;
    this.teamService.getTeamById(user.teamFunctionId).subscribe((data: TeamFromDBEntity) => { team = data });

    this.ptoeditorForm = this.fb.group({
      id: [this.pto.id],
      userId: [this.pto.userId, Validators.required],
      location: ["", Validators.required],
      requestTypeId: ["", Validators.required],
      description: [this.pto.description, Validators.maxLength(50)],
      hours: [this.pto.hours, [Validators.required,
                                              ValidateHours(this.pto.allDay, this.pto.startDate, this.pto.startTime, this.pto.endDate, this.pto.endTime, team)]],
      allDay: [this.pto.allDay, Validators.required ],
      startDate: [this.pto.startDate, Validators.required],
      startTime: [this.pto.startTime, [Validators.required, Validators.min(0.01), Validators.max(12.59)]],
      endDate: [this.pto.endDate, Validators.required],
      endTime: [this.pto.endTime, [Validators.required, Validators.min(0.01), Validators.max(12.59)]]
    });
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

  onNoClick(event: any): void {
    event.stopPropogation();
    this.dialogRef.close();
    this.pto = null;
  }
}
