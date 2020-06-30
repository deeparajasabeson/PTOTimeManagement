import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { CommonLibrary } from '../../_library/common.library';
import { UserService } from '../../_services/user.service';
import { AuthService } from '../../_services/auth.service';
import { TeamService } from '../../_services/team.service';
import { RoleService } from '../../_services/role.service';
import { LocationService } from '../../_services/location.service';
import { DataStorageService } from '../../_services/datastorage.service';
import { UserFormData } from '../../_viewmodels/UserFormData';
import { UserFromDBEntity } from '../../_entities/UserFromDBEntity';
import { UserEntity } from '../../_entities/UserEntity';
import { LocationFromDBEntity } from '../../_entities/LocationFromDBEntity';
import { RoleFromDBEntity } from '../../_entities/RoleFromDBEntity';
import { TeamFromDBEntity } from '../../_entities/TeamFromDBEntity';
import { LoginFormData } from '../../_viewmodels/LoginFormData';
import { RegisterCustomValidators } from '../../_validators/RegisterCustomValidators.validator';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  userForm: FormGroup;
  loginData: LoginFormData;

  currentUser: UserFromDBEntity;
  leadershipUsers: UserFromDBEntity[] = [];
  locations: LocationFromDBEntity[] = [];
  roles: RoleFromDBEntity[] = [];
  teams: TeamFromDBEntity[] = [];

  showProfile: boolean;
  isNewUser: true;

  constructor(private router: Router,
                        private formBuilder: FormBuilder,
                        private userService: UserService,
                        private authService: AuthService,
                        private locationService: LocationService,
                        private roleService: RoleService,
                        private teamService: TeamService,
                        private dataStorageService: DataStorageService) { }

  ngOnInit() {
    this.isNewUser = true;
    this.showProfile = false;
    this.readDataFromDB();

    this.userForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.registerForm = this.formBuilder.group({
      id: [''],
      isNewUser: [true],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: [''],
      ntLogin: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      report2UserId: ['', Validators.required],
      locationId: ['', Validators.required],
      roleId: ['', Validators.required],
      teamId: ['', Validators.required],
    }, {
        validator: RegisterCustomValidators.MustMatchPassword(this.userForm.value.password)
    });
  }

  readDataFromDB() {
    setTimeout(() => {
      this.locationService.getLocations().toPromise().then((locationdata: LocationFromDBEntity[]) => {
        locationdata.forEach(val => this.locations.push(Object.assign({}, val)));

        this.roleService.getRoles().toPromise().then((roledata: RoleFromDBEntity[]) => {
          roledata.forEach(val => this.roles.push(Object.assign({}, val)));

          this.teamService.getTeams().toPromise().then((teamdata: TeamFromDBEntity[]) => {
            teamdata.forEach(val => this.teams.push(Object.assign({}, val)));
          });
        });
      });
    }, 5000);
  }
  // convenience getter for easy access to form fields
  get u() { return this.userForm.controls; }
  get r() { return this.registerForm.controls; }

  login(userFormData: LoginFormData) {
    this.loginData = {
      userName: userFormData.userName,
      password: userFormData.password
    };
    this.userService.login(this.loginData).toPromise().then((response: any) => {
      this.currentUser = (<any>response).user;
    });
  }

  onReset() {
    this.registerForm.reset();
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  onLocationChange(locationId: string) {
    this.userService
      .getLeadershipUsers(locationId)
      .toPromise()
      .then((leadershipusers: UserFromDBEntity[]) => {
        leadershipusers.forEach(val => this.leadershipUsers.push(Object.assign({}, val)));
      });
    this.registerForm.get('leadershipUsers').setValue(this.leadershipUsers);
  }

  register(registerUser: UserFormData) {
    let user: UserEntity = {
      id : registerUser.id,
      firstName: registerUser.firstName,
      lastName: registerUser.lastName,
      userName : registerUser.userName,
      password : registerUser.password,
      ntLogin : registerUser.ntLogin,
      emailAddress : registerUser.emailAddress,
      roleId : registerUser.roleId,
      reportToUserId : registerUser.report2UserId,
      locationId : registerUser.locationId,
      teamFunctionId : registerUser.teamId,
      isActive : true,
      createdBy: registerUser.id,
      createdOn: new Date(),
      updatedBy: registerUser.id,
      updatedOn: new Date()
    };

    if (registerUser.id == '') {
      user.id = CommonLibrary.GenerateUUID();
      user.createdBy = user.id;
      user.updatedBy = user.id;
      this.userService.registerUser(user);
    }
    else {
      this.userService.updateUser(user);
    }
  }

  deleteUser(userId: string) {
    this.userService.deleteUser(userId);
  }

  onBack(): void {
    this.router.navigate(['/login']);
  }
}
