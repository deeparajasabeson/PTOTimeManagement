import { Component, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { DataStorageService } from '../../_services/datastorage.service';
import { DataSharingService } from '../../_services/datasharing.service';
import { HeaderBarComponent } from '../../public/header-bar/header-bar.component';

@Component({
  providers: [HeaderBarComponent],
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  invalidLogin: boolean = false;
  @ViewChild('loginForm', null) loginForm: any;

  constructor(private router: Router,
                      private auth: AuthService,
                      private dataStorageService: DataStorageService,
                      private dataSharingService: DataSharingService,
                      private headerBarComponent: HeaderBarComponent) { }

  public login(loginForm: NgForm) {
    this.auth.login(loginForm)
      .subscribe(response =>
      {
        let token = (<any>response).token;
        let user = (<any>response).user;
        let team = (<any>response).team;
        this.dataStorageService.setUserEntity(user);
        this.dataStorageService.setTeamEntity(team);
        localStorage.setItem("jwt", token);
        this.invalidLogin = false;
        this.dataSharingService.isUserAuthenticated.next(true);   // After the user has logged in, emit the behavior subject changes.
        this.headerBarComponent.ngOnInit();   // to update notification counters in header-bar
        this.router.navigate(["/pto-calendar"]);
      }, err => {
              console.log("Error Occured :");
              console.log(err);
              this.invalidLogin = true;
      });
  }
}
