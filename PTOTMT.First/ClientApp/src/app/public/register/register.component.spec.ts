import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { LocationService } from '../../_services/location.service';
import { RoleService } from '../../_services/role.service';
import { TeamService } from '../../_services/team.service';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockUserService = jasmine.createSpyObj('UserService', ['login']);
  let mockLocationService = jasmine.createSpyObj('LocationService', ['getLocations']);
  let mockRoleService = jasmine.createSpyObj('RoleService', ['getRoles']);
  let mockTeamService = jasmine.createSpyObj('TeamService', ['getTeams']);
  let mockFormBuilder = jasmine.createSpyObj('FormBuilder', ['group']);
  let mockRouter = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: LocationService, useValue: mockLocationService },
        { provide: RoleService, useValue: mockRoleService },
        { provide: TeamService, useValue: mockTeamService },
        { provide: FormBuilder, useValue: mockFormBuilder },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });
  beforeEach(() => {
      fixture = TestBed.createComponent(RegisterComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Registerform should be invalid', () => {
    component.registerForm.controls['id'].setValue('');
    component.registerForm.controls['confirmPassword'].setValue('');
    component.registerForm.controls['firstName'].setValue('');
    component.registerForm.controls['lastName'].setValue('');
    component.registerForm.controls['ntLogin'].setValue('');
    component.registerForm.controls['emailAddress'].setValue('');
    component.registerForm.controls['reportToUserId'].setValue('');
    component.registerForm.controls['locationId'].setValue('');
    component.registerForm.controls['roleId'].setValue('');
    component.registerForm.controls['teamId'].setValue('');
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('Userform should be valid', () => {
    component.userForm.controls['userName'].setValue('test');
    component.userForm.controls['password'].setValue('test@gmail.com');
    expect(component.userForm.valid).toBeTruthy();
  });
});
