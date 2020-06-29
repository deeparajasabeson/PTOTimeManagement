import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { TeamService } from '../../_services/team.service';
import { RoleService } from '../../_services/role.service';
import { LocationService } from '../../_services/location.service';
import { UserFromDBEntity } from '../../_entities/UserFromDBEntity';
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
  leadershipUsers: UserFromDBEntity[];
  locations: LocationFromDBEntity[];
  roles: RoleFromDBEntity[];
  teams: TeamFromDBEntity[];

  constructor(private router: Router,
                        private formBuilder: FormBuilder,
                        private userService: UserService,
                        private locationService: LocationService,
                        private roleService: RoleService,
                        private teamService: TeamService ) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: [''],
      ntLogin: ['', Validators.required],
      emailAddress: ['', Validators.required],
      leadershipUsers: [this.leadershipUsers],
      report2User: ['', Validators.required],
      locationTypes: [this.locations],
      locationId: ['', Validators.required],
      roles: [this.roles],
      roleId: ['', Validators.required],
      teams: [this.teams],
      teamId: ['', Validators.required]
    });
    this.readDataFromDB();
  }

  readDataFromDB() {
    this.locationService.getLocations().toPromise().then((locationdata: LocationFromDBEntity[]) => {
      this.locations = locationdata;

      this.roleService.getRoles().toPromise().then((roledata: RoleFromDBEntity[]) => {
        this.roles = roledata;

        this.teamService.getTeams().toPromise().then((teamdata: TeamFromDBEntity[]) => {
          this.teams = teamdata;
        });
      });
    });
  }

  onLocationChange(locationId: string) {
    this.userService
      .getLeadershipUsers(locationId)
      .toPromise()
      .then((leadershipusers: UserFromDBEntity[]) => {
        this.leadershipUsers = leadershipusers;
      });
    this.registerForm.get('leadershipUsers').setValue(this.leadershipUsers);
  }

  register(registerForm: NgForm) {
  }

  deleteUser(userId: string) {
  }

  onBack(): void {
    this.router.navigate(['/login']);
  }
}
