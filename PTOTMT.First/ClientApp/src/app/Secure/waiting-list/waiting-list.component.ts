import { Component, OnInit } from '@angular/core';

import { PTOFromDBEntity } from '../../_entities/PTOFromDBEntity';
import { FlexFromDBEntity } from '../../_entities/FlexFromDBEntity';
import { DataSharingService } from '../../_services/datasharing.service';
import { StatusService } from '../../_services/status.service';
import { CommonLibrary } from '../../_library/common.library';
import { StatusFromDBEntity } from '../../_entities/StatusFromDBEntity';


@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
})
export class WaitingListComponent implements OnInit {

  userRequestList: PTOFromDBEntity[];
  userFlexList: FlexFromDBEntity[];
  waitingList: StatusFromDBEntity;

  constructor(private dataSharingService: DataSharingService,
                      private statusService: StatusService) { }

  ngOnInit() {
    this.statusService.getStatusByName("WaitingList")
      .toPromise()
      .then((data: StatusFromDBEntity) => { this.waitingList = data });

    this.userRequestList = this.dataSharingService.userRequestList.getValue().filter(this.isWaitingList);
    this.userRequestList = CommonLibrary.sortListByProperty(this.userRequestList, "startDateTime");

    this.userFlexList = this.dataSharingService.userFlexList.getValue().filter(this.isWaitingList);
    this.userFlexList = CommonLibrary.sortListByProperty(CommonLibrary.sortListByProperty(this.userFlexList, "startDateTime"), "flexTypeId");
  }

  isWaitingList(element, index, array) {
     return (element.statusId == this.waitingList.id);
  }
}
