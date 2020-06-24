import { Component, OnInit } from '@angular/core';

import { PTOFromDBEntity } from '../../_entities/PTOFromDBEntity';
import { FlexFromDBEntity } from '../../_entities/FlexFromDBEntity';
import { DataSharingService } from '../../_services/datasharing.service';

@Component({
  selector: 'app-team-notifications',
  templateUrl: './team-notifications.component.html',
  styleUrls: ['./team-notifications.component.css']
})
export class TeamNotificationsComponent implements OnInit {
  teamRequestList: PTOFromDBEntity[];
  teamFlexList: FlexFromDBEntity[];

  constructor(private dataSharingService: DataSharingService) { }

  ngOnInit() {
    this.teamRequestList = this.dataSharingService.userRequestList.value;
    this.teamFlexList = this.dataSharingService.userFlexList.getValue();
  }
}
