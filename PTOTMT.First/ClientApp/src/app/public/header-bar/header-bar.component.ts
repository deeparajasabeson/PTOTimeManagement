import { Component, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

import { TeamFromDBEntity } from '../../_entities/TeamFromDBEntity';
import { UserFromDBEntity } from '../../_entities/UserFromDBEntity';
import { PTOFromDBEntity } from '../../_entities/PTOFromDBEntity';
import { FlexFromDBEntity } from '../../_entities/FlexFromDBEntity';
import { DataStorageService } from '../../_services/datastorage.service';
import { FlexService } from '../../_services/flex.service';
import { PTOService } from '../../_services/pto.service';
import { LoginNavMenuComponent } from '../login-nav-menu/login-nav-menu.component';
import { DataSharingService } from '../../_services/datasharing.service';
import { Router } from '@angular/router';
import { request } from 'http';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderBarComponent implements AfterViewChecked {
  @ViewChild(LoginNavMenuComponent, { static: true }) loginNavMenu: LoginNavMenuComponent;
  toChild = {
    userCounter: 0,
    teamCounter: 0,
    isLeadership: false
  };

  isExpanded = false;
  user: UserFromDBEntity;
  team: TeamFromDBEntity;

  constructor(private dataStorageService: DataStorageService,
                      private dataSharingService: DataSharingService,
                      private ptoService: PTOService,
                      private flexService: FlexService,
                      private cdr: ChangeDetectorRef,
                      private router: Router) { }

  ngOnInit() {
    if (this.dataSharingService.isUserAuthenticated.value) {
      this.CountRequests();
    }
  }

  ngAfterViewChecked() {
    if (this.dataSharingService.isUserAuthenticated.value) {
      this.loginNavMenu.fromParent.userCounter = this.toChild.userCounter;
      if (this.toChild.isLeadership) {
        this.loginNavMenu.fromParent.teamCounter = this.toChild.teamCounter;
      }
      this.cdr.detectChanges();
    }
  }

  showUserNotifications() {
    this.router.navigate(["/user-notifications"]);
    console.log("User Notifications clicked - from Header-Bar Component");
  }

  showTeamNotifications() {
    this.router.navigate(["/team-notifications"]);
    console.log("Team Notifications clicked - from Header-Bar Component");
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  CountRequests() {
    this.user = this.dataStorageService.getUserEntity();
    this.team = this.dataStorageService.getTeamEntity();
    this.toChild.isLeadership = (this.team.name == 'Leadership / Admin');
    if (this.toChild.isLeadership) {
      this.CountTeamRequests();
    }
    this.CountUserRequests();
  }

  sortListByProperty<T>(list: T[], propName: string): T[] {
    return list.sort((a, b) => {
      if (a[propName] < b[propName]) { return -1; }
      if (a[propName] > b[propName]) { return 1; }
      return 0;
    });
  }

  CountUserRequests() {
    //Active PTO Requests count for the current user
    let ptoResponse = this.ptoService.getPTOsByUserIdInDateRange(this.user.id, new Date(), new Date(1111, 10, 1, 1, 11, 11));
    ptoResponse.then((data: PTOFromDBEntity[]) => {
      let requestList = data;

      requestList = this.sortListByProperty(requestList, "startDateTime");

      this.dataSharingService.userRequestList.next(requestList);
      if (this.dataSharingService.isUserAuthenticated.value) {
        //Active Flex Requests count for the current user
        let flexResponse = this.flexService.getFlexsByUserIdInDateRange(this.user.id, new Date(), new Date(1111, 10, 1, 1, 11, 11));
        flexResponse.then((data: FlexFromDBEntity[]) => {
          let flexList = data;

          flexList = this.sortListByProperty(this.sortListByProperty(flexList, "startDateTime"), "flexTypeId");

          this.dataSharingService.userFlexList.next(flexList);
          this.toChild.userCounter = requestList.length + flexList.length;
        });
      }
    });
  }

  CountTeamRequests() {
    //Active PTO Requests count of all Reporting Team Members
    let ptoReporingMembersResponse = this.ptoService.getRequestsReportingMembers(this.user.id, new Date(), new Date(1111, 10, 1, 1, 11, 11));
    ptoReporingMembersResponse.then((data: PTOFromDBEntity[]) => {
      let requestList = data;

      requestList = this.sortListByProperty(requestList, "startDateTime");

      this.dataSharingService.teamRequestList.next(requestList);
      if (this.dataSharingService.isUserAuthenticated.value) {
        //Active Flex Requests count of all Reporting Team Members
        let flexResponse = this.flexService.getFlexsReportingMembers(this.user.id, new Date(), new Date(1111, 10, 1, 1, 11, 11));
        flexResponse.then((data: FlexFromDBEntity[]) => {
          let flexList = data;

          flexList = this.sortListByProperty(this.sortListByProperty(flexList, "startDateTime"), "flexTypeId");

          this.dataSharingService.teamFlexList.next(flexList);
          this.toChild.teamCounter = requestList.length + flexList.length;
          console.log("TeamCounter : " + this.toChild.teamCounter);
        });
      }
    });
  }
}
