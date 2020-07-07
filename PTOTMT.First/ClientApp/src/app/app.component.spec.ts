import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let appComponent: AppComponent = null;;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({ declarations: [ AppComponent ], }).compileComponents();
    appComponent = new AppComponent();
    fixture = TestBed.createComponent(AppComponent);
    //appComponent = fixture.componentInstance;
    appComponent = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the app', async(() => {
      expect(appComponent).toBeTruthy();
  }));

  it('should set instance correctly', () => {
    expect(appComponent).not.toBeNull();
  });

  it(`should have as title 'app works!'`, async(() => {
    expect(appComponent.title).toEqual('app works!');
  }));
});
