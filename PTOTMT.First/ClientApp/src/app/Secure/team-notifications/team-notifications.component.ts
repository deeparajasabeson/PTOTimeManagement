import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PTOFromDBEntity } from '../../_entities/PTOFromDBEntity';
import { FlexFromDBEntity } from '../../_entities/FlexFromDBEntity';
import { DataSharingService } from '../../_services/datasharing.service';
import { CommonLibrary } from '../../_library/common.library';


@Component({
  selector: 'app-team-notifications',
  templateUrl: './team-notifications.component.html',
  styleUrls: ['./team-notifications.component.css']
})
export class TeamNotificationsComponent implements OnInit {
  teamRequestList: PTOFromDBEntity[];
  teamFlexList: FlexFromDBEntity[];

  constructor(private dataSharingService: DataSharingService,
                      private router: Router) { }

  ngOnInit() {
    this.teamRequestList = this.dataSharingService.userRequestList.getValue();
    this.teamRequestList = CommonLibrary.sortListByProperty(this.teamRequestList, "startDateTime");

    this.teamFlexList = this.dataSharingService.userFlexList.getValue();
    this.teamFlexList = CommonLibrary.sortListByProperty(CommonLibrary.sortListByProperty(this.teamFlexList, "startDateTime"), "flexTypeId");
  }

  viewWaitingList() {
    this.router.navigate(["/waitinglist"]);
  }
}
