import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginNavMenuComponent } from './login-nav-menu.component';

describe('LoginNavMenuComponent', () => {
  let component: LoginNavMenuComponent;
  let fixture: ComponentFixture<LoginNavMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginNavMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginNavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
