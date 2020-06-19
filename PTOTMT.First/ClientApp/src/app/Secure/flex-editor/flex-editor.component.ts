import { Component, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { NgbDateStruct, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material.module';
import { FlexCustomValidators } from '../../_validators/FlexCustomValidators.Validator';
import { FlexService } from '../../_services/flex.service';
import { FlexDialogData } from '../../_viewmodels/FlexDialogData';
import { FlexTypeFromDBEntity } from '../../_entities/FlexTypeFromDBEntity';
import { CommonLibrary } from '../../_library/common.library';
import { ValidateMinutes } from '../../_validators/ValidateMinutes';
import { TeamService } from '../../_services/team.service';
import { DataStorageService } from '../../_services/datastorage.service';
import { TeamFromDBEntity } from '../../_entities/TeamFromDBEntity';


@Component({
  selector: 'app-flex-editor',
  templateUrl: './flex-editor.component.html',
  styleUrls: ['./flex-editor.component.css']
})
export class FlexEditorComponent implements OnInit {
  @ViewChild('dp', null) dp: NgbDatepicker;
  @Input() public flex: FlexDialogData;  
  flexTypes: FlexTypeFromDBEntity[];

  flexeditorForm: FormGroup;
  private toDate = new Date();  //used in endDate filter in calendar template
  toDateNgbDateStruct: NgbDateStruct = CommonLibrary.Date2NgbDateStruct(this.toDate);

  constructor(
    private dialogRef: MatDialogRef<FlexEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public dataDialog: FlexDialogData,  
    private fb: FormBuilder,
    private flexService: FlexService,
    private datastorageService: DataStorageService,
    private teamService: TeamService) { }

  ngOnInit() {
    if (this.flex.flexTypeId == "" && this.flex.flexTypes.length > 0) {
      this.flex.flexTypeId = this.flex.flexTypes.find(rt => rt.name == "Shift Slide").id;
    }
    this.flexeditorForm = this.fb.group({
      id: [this.flex.id],
      userId: [this.flex.userId],
      flexTypeId: [this.flex.flexTypeId, Validators.required],
      description: [this.flex.description, Validators.maxLength(50)],
      isForward: [this.flex.isForward, Validators.required],
      hours: [Math.floor(this.flex.hours), [Validators.required, Validators.min(0), Validators.max(3)]],
      minutes: [(this.flex.hours - Math.floor(this.flex.hours)) * 100, [Validators.min(0), Validators.max(30), ValidateMinutes]],
      onDate: [this.flex.onDate, Validators.required],
      startTime: [this.flex.startTime],
      endTime: [this.flex.endTime],
      isNewEvent: [this.flex.isNewEvent]
    }, {
        validator: FlexCustomValidators.ValidateHours()
    });
    this.flexTypes = [];
    this.flex.flexTypes.forEach(val => this.flexTypes.push(Object.assign({}, val)));
  }

  navigateEvent(event) {
    this.flex.onDate = event.next;
  }

  saveFlex(flexForm: NgForm): void {  
    if (this.flexeditorForm.valid) {
      this.dialogRef.close(this.flexeditorForm.value);
      if (this.flexeditorForm.valid) {
        this.flex = this.flexeditorForm.value;
        debugger;
      }
    }
  }

  deleteFlex(flexForm: NgForm): void {
    this.dialogRef.close();
    this.flex = this.flexeditorForm.value;
    if (confirm("Want to delete this flex -- " + this.flex.description + " ?")) {
      this.flexService.deleteFlex(this.flex.id);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.flex = null;
  }
}

