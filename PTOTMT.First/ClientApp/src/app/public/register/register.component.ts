import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../_services/user.service';
import { TeamService } from '../../_services/team.service';
import { RoleService } from '../../_services/role.service';
import { LocationService } from '../../_services/location.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  constructor( private router: Router,
                        private userService: UserService,
                        private locationService: LocationService,
                        private roleService: RoleService,
                        private teamService: TeamService ) { }

  ngOnInit() {

  }

  register(registerForm: NgForm) {
  }

  deleteUser(userId: string) {
  }

  onBack(): void {
    this.router.navigate(['/login']);
  }
}
