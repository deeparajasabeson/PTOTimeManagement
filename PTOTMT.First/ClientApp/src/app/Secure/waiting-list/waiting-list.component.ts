import { Component, OnInit } from '@angular/core';

import { PTOFromDBEntity } from '../../_entities/PTOFromDBEntity';
import { FlexFromDBEntity } from '../../_entities/FlexFromDBEntity';
import { StatusFromDBEntity } from '../../_entities/StatusFromDBEntity';
import { FlexTypeFromDBEntity } from '../../_entities/FlexTypeFromDBEntity';
import { CommonLibrary } from '../../_library/common.library';
import { DataSharingService } from '../../_services/datasharing.service';
import { StatusService } from '../../_services/status.service';
import { FlexTypeService } from '../../_services/flextype.service';
import { FlexService } from '../../_services/flex.service';
import { PTOService } from '../../_services/pto.service';


@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
})
export class WaitingListComponent implements OnInit {

  userRequestList: PTOFromDBEntity[];
  userFlexList: FlexFromDBEntity[];
  waitingList: StatusFromDBEntity;
  shiftSwapRequest: FlexTypeFromDBEntity;

  constructor(private dataSharingService: DataSharingService,
                      private statusService: StatusService,
                      private flexTypeService: FlexTypeService,
                      private flexService: FlexService,
                      private ptoService: PTOService) { }

  ngOnInit() {
    this.statusService.getStatusByName("WaitingList")
      .toPromise()
      .then((data: StatusFromDBEntity) => { this.waitingList = data });

    this.userRequestList = this.dataSharingService.userRequestList.getValue().filter(this.isWaitingList);
    this.userRequestList = CommonLibrary.sortListByProperty(this.userRequestList, "startDateTime");

    this.userFlexList = this.dataSharingService.userFlexList.getValue().filter(this.isWaitingList);
    this.userFlexList = CommonLibrary.sortListByProperty(CommonLibrary.sortListByProperty(this.userFlexList, "startDateTime"), "flexTypeId");

    this.flexTypeService.getFlexTypeByName("Shift Swap Request").toPromise().then((data: FlexFromDBEntity) => { this.shiftSwapRequest = data; });
  }

  isWaitingList(element, index, array) {
    return (element.statusId == this.waitingList.id &&
                this.shiftSwapRequest != null &&
                element.flexTypeId != this.shiftSwapRequest.id);
  }

  approvePTO(ptoId: string) {
    this.ptoService.approvePTO(ptoId);
  }

  approveFlex(flexId: string) {
    this.flexService.approveFlex(flexId);
  }
}
