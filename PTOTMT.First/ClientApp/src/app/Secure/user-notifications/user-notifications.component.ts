import { Component, OnInit } from '@angular/core';

import { PTOFromDBEntity } from '../../_entities/PTOFromDBEntity';
import { FlexFromDBEntity } from '../../_entities/FlexFromDBEntity';
import { DataSharingService } from '../../_services/datasharing.service';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.css']
})
export class UserNotificationsComponent implements OnInit {

  userRequestList: PTOFromDBEntity[];
  userFlexList: FlexFromDBEntity[];

  constructor(private dataSharingService: DataSharingService) { }

  ngOnInit() {
    this.userRequestList = this.dataSharingService.userRequestList.value;
    this.userFlexList = this.dataSharingService.userFlexList.getValue();
  }
}
