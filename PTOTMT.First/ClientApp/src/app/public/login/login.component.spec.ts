import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../_services/auth.service';
import { DataSharingService } from '../../_services/datasharing.service';
import { DataStorageService } from '../../_services/datastorage.service';
import { HeaderBarComponent } from '../header-bar/header-bar.component';
import { Router } from '@angular/router';


describe('LoginComponent', () => {
    let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockDataSharingService = jasmine.createSpyObj('DataSharingService', ['isUserAuthenticated.next']);
  let mockDataStorageService = jasmine.createSpyObj('DataStorageService', ['setUserEntity', 'setTeamEntity']);
  let mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
  let mockHeaderBarComponent = jasmine.createSpyObj('HeaderBarComponent', ['ngOnInit']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [ HttpClientTestingModule ],
        declarations: [ LoginComponent ],
        providers: [
          { provide: DataSharingService, useValue: mockDataSharingService },
          { provide: DataStorageService, useValue: mockDataStorageService },
          { provide: AuthService, useValue: mockAuthService },
          { provide: HeaderBarComponent, useValue: mockHeaderBarComponent },
          { provide: Router, useValue: mockRouter }
        ]
      });
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

  it(`should have as invalidLogin 'false'`, async(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.debugElement.componentInstance;
    expect(component.invalidLogin).toEqual(false);
  }));
});
