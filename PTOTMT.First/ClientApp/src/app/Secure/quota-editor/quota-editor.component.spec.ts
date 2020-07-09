import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { QuotaEditorComponent } from './quota-editor.component';
import { QuotaService } from '../../_services/quota.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CommonLibrary } from '../../_library/common.library';

describe('QuotaEditorComponent', () => {

  let component: QuotaEditorComponent;
  let fixture: ComponentFixture<QuotaEditorComponent>;
  let debugElement: DebugElement;
  let element: HTMLElement;

  let mockQuotaService = jasmine.createSpyObj('QuotaService', ['deleteQuota']);
  let mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
  let mockFormBuilder = jasmine.createSpyObj('FormBuilder', ['group']);
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [QuotaEditorComponent],
        providers: [
          { provide: QuotaService, useValue: mockQuotaService },
          { provide: MatDialogRef, useValue: mockMatDialogRef },
          { provide: FormBuilder, useValue: mockFormBuilder },
          { provide: MAT_DIALOG_DATA, useValue: {}}
        ],
        imports: [BrowserModule, FormsModule, ReactiveFormsModule]
      }).compileComponents().then(() => {

        fixture = TestBed.createComponent(QuotaEditorComponent);
        component = fixture.componentInstance;
        let toDateNgbDateStruct: NgbDateStruct = CommonLibrary.Date2NgbDateStruct(new Date());
        component.quota = {
          id: "",
          quotaName: "",
          teamId: "",
          teams: [],
          originalHours: 0, 
          minutes: 0,
          remainingHours: 0,
          startDate: toDateNgbDateStruct,
          startTime: "00:00",
          endDate: toDateNgbDateStruct,
          endTime: "00:00",
          description: "",
          isNewEvent: true
        }
        fixture.detectChanges();
        debugElement = fixture.debugElement.query(By.css('form'));
        element = debugElement.nativeElement;
     });
    }));

  //it('should create', () => {
  //    expect(component).toBeTruthy();
  //});

  //it('should set quota to null in onNoClick()', () => {
  //  component.onNoClick(1);
  //  expect(component.quota).toBeNull;
  //});

  //it('should call the saveQuota method', () => {
  //  spyOn(component, 'saveQuota');

  //  element = fixture.debugElement.query(By.css('.save')).nativeElement;
  //  element.click();
  //  expect(component.saveQuota).toHaveBeenCalledTimes(0);
  //});
});
