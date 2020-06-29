import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CommonLibrary } from '../../_library/common.library';
import { UserService } from '../../_services/user.service';
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


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  user: UserFromDBEntity;
  registerForm: FormGroup;
  loginForm: FormGroup;
  leadershipUsers: UserFromDBEntity[];
  locations: LocationFromDBEntity[];
  roles: RoleFromDBEntity[];
  teams: TeamFromDBEntity[];
  currentUser: UserFromDBEntity;

  constructor(private router: Router,
                        private formBuilder: FormBuilder,
                        private userService: UserService,
                        private locationService: LocationService,
                        private roleService: RoleService,
                        private teamService: TeamService,
                        private dataStorageService: DataStorageService) { }

  ngOnInit() {
    this.currentUser = this.dataStorageService.getUserEntity();
    this.loginForm = this.formBuilder.group({
      id: [''],
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerForm = this.formBuilder.group({
      id:[''],
      firstName: ['', Validators.required],
      lastName: [''],
      ntLogin: ['', Validators.required],
      emailAddress: ['', Validators.required],
      leadershipUsers: [this.leadershipUsers],
      report2UserId: ['', Validators.required],
      locationTypes: [this.locations],
      locationId: ['', Validators.required],
      roles: [this.roles],
      roleId: ['', Validators.required],
      teams: [this.teams],
      teamId: ['', Validators.required],
      isNewUser: [true]
    });

    this.readDataFromDB();
  }

  readDataFromDB() {
    this.locationService.getLocations().toPromise().then((locationdata: LocationFromDBEntity[]) => {
      locationdata.forEach(val => this.locations.push(Object.assign({}, val)));

      this.roleService.getRoles().toPromise().then((roledata: RoleFromDBEntity[]) => {
        roledata.forEach(val => this.roles.push(Object.assign({}, val)));

        this.teamService.getTeams().toPromise().then((teamdata: TeamFromDBEntity[]) => {
          teamdata.forEach(val => this.teams.push(Object.assign({}, val)));
        });
      });
    });
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
      createdBy: this.currentUser.id,
      createdOn: new Date(),
      updatedBy: this.currentUser.id,
      updatedOn: new Date()
    };

    if (registerUser.id == '') {
      user.id = CommonLibrary.GenerateUUID();
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
