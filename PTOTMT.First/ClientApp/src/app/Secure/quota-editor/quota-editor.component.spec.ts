import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaEditorComponent } from './quota-editor.component';

describe('QuotaEditorComponent', () => {
  let component: QuotaEditorComponent;
  let fixture: ComponentFixture<QuotaEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotaEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
