import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PTOEditorComponent } from './pto-editor.component';

describe('PTOEditorComponent', () => {
  let component: PTOEditorComponent;
  let fixture: ComponentFixture<PTOEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PTOEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PTOEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
