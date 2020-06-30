import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { RegisterCustomValidators } from '../../_validators/RegisterCustomValidators.validator';
import { CommonLibrary } from '../../_library/common.library';
import { UserService } from '../../_services/user.service';
import { TeamService } from '../../_services/team.service';
import { RoleService } from '../../_services/role.service';
import { LocationService } from '../../_services/location.service';
import { UserFormData } from '../../_viewmodels/UserFormData';
import { UserFromDBEntity } from '../../_entities/UserFromDBEntity';
import { UserEntity } from '../../_entities/UserEntity';
import { LocationFromDBEntity } from '../../_entities/LocationFromDBEntity';
import { RoleFromDBEntity } from '../../_entities/RoleFromDBEntity';
import { TeamFromDBEntity } from '../../_entities/TeamFromDBEntity';
import { LoginFormData } from '../../_viewmodels/LoginFormData';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  userForm: FormGroup;
  loginData: LoginFormData;

  user: UserFromDBEntity;
  leadershipUsers: UserFromDBEntity[] = [];
  locations: LocationFromDBEntity[] = [];
  roles: RoleFromDBEntity[] = [];
  teams: TeamFromDBEntity[] = [];

  showProfile: boolean;
  isNewUser: boolean;

  constructor(private router: Router,
                        private formBuilder: FormBuilder,
                        private userService: UserService,
                        private locationService: LocationService,
                        private roleService: RoleService,
                        private teamService: TeamService) { }

  ngOnInit() {
    this.isNewUser = true;
    this.showProfile =  false;
    this.readDataFromDB();

    this.userForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.registerForm = this.formBuilder.group({
      id: [''],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: [''],
      ntLogin: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      reportToUserId: ['', Validators.required],
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
            this.onLocationChange(this.locations[0].id);
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
      this.user = (<any>response).user;

      this.onLocationChange(this.user.locationId);

      if (this.user.id != undefined && this.user.id != null && this.user.id != '') {
        this.registerForm.controls.confirmPassword.disable();
        this.registerForm.controls.firstName.setValue(this.user.firstName);
        this.registerForm.controls.lastName.setValue(this.user.lastName);
        this.registerForm.controls.ntLogin.setValue(this.user.ntLogin);
        this.registerForm.controls.emailAddress.setValue(this.user.emailAddress);
        this.registerForm.controls.reportToUserId.setValue(this.user.reportToUserId);
        this.registerForm.controls.locationId.setValue(this.user.locationId);
        this.registerForm.controls.roleId.setValue(this.user.roleId);
        this.registerForm.controls.teamId.setValue(this.user.teamFunctionId);
      }
      this.showProfile = true;
      this.isNewUser = false;
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
    setTimeout(() => {
    this.userService
      .getLeadershipUsers(locationId)
      .toPromise()
      .then((leadershipusers: UserFromDBEntity[]) => {
        this.leadershipUsers = [];
        leadershipusers.forEach(val => this.leadershipUsers.push(Object.assign({}, val)));
      });
    }, 2000);
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
      reportToUserId : registerUser.reportToUserId,
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
