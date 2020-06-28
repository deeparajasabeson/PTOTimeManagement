import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { PTOFromDBEntity } from '../../_entities/PTOFromDBEntity';
import { FlexFromDBEntity } from '../../_entities/FlexFromDBEntity';
import { RequestDisplayDialogData } from '../../_viewmodels/RequestDisplayDialogData';
import { PTOService } from '../../_services/pto.service';
import { FlexService } from '../../_services/flex.service';
import { FlexTypeService } from '../../_services/flextype.service';
import { CommonLibrary } from '../../_library/common.library';
import { RequestDisplayDialogComponent } from '../request-display-dialog/request-display-dialog.component';


@Component({
  selector: 'app-request-display',
  templateUrl: './request-display.component.html'
})
export class RequestDisplayComponent implements OnInit {
  requestId: string;
  requestDisplayDialogData: RequestDisplayDialogData;

  constructor(private activatedRoute: ActivatedRoute,
    private ptoService: PTOService,
    private flexService: FlexService,
    private flexTypeService: FlexTypeService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param => {
      this.requestId = param.get('id');
      this.requestDisplayDialogData.isPTO = (param.get('isPTO') == "true");

      if (this.requestDisplayDialogData.isPTO) {
        this.ptoService.getPTOById(this.requestId)
          .toPromise().then((request: PTOFromDBEntity) => {
            this.requestDisplayDialogData.ptoRequest = request;
          });
      }
      else {
        this.flexService.getFlexById(this.requestId)
          .toPromise().then((request: FlexFromDBEntity) => {
            this.requestDisplayDialogData.flexRequest = request;
            let flexTypeName = this.flexTypeService.getFlexTypeById(request.flexTypeId);

            this.requestDisplayDialogData.isShiftSwap = (flexTypeName == "Shift Swap");
            this.requestDisplayDialogData.isSelfShiftSwap = (flexTypeName == "Self-Shift Swap");
            this.requestDisplayDialogData.isShiftSlide = (flexTypeName == "Shift Slide");
            this.requestDisplayDialogData.isPreArrangedShiftSlide = (flexTypeName == "Pre-Arranged Shift Slide");
          });
      }
    });
    let dialogConfig = CommonLibrary.CreateDialog();
    dialogConfig.id = "request-display";
    dialogConfig.height = (this.requestDisplayDialogData.isSelfShiftSwap) ? "75%" : "85%";
    dialogConfig.width = "65%";
    dialogConfig.data = { data: this.requestDisplayDialogData };
    var dialogRef = this.dialog.open(RequestDisplayDialogComponent, dialogConfig);
    dialogRef.componentInstance.data = this.requestDisplayDialogData;  //another way to pass data to modal window
  }
}
