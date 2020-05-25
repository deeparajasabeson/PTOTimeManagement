import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaCalendarComponent } from './quota-calendar.component';

describe('QuotaCalendarComponent', () => {
  let component: QuotaCalendarComponent;
  let fixture: ComponentFixture<QuotaCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotaCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
