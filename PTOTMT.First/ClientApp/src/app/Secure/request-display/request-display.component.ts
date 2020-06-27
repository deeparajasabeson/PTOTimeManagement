import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material';

import { PTOFromDBEntity } from '../../_entities/PTOFromDBEntity';
import { FlexFromDBEntity } from '../../_entities/FlexFromDBEntity';
import { PTOService } from '../../_services/pto.service';
import { FlexService } from '../../_services/flex.service';
import { FlexTypeService } from '../../_services/flextype.service';
import { CommonLibrary } from '../../_library/common.library';


@Component({
  selector: 'app-request-display',
  templateUrl: './request-display.component.html',
  styleUrls: ['./request-display.component.css']
})
export class RequestDisplayComponent implements OnInit {
  parentUrl: string;
  requestId: string;
  isFlexRequest: boolean = false ;
  isShiftSwap: boolean = false;
  isSelfShiftSwap: boolean = false;
  isShiftSlide: boolean = false;
  isPreArrangedShiftSlide: boolean = false;
  dialogRef;

  ptoRequest: PTOFromDBEntity;
  flexRequest: FlexFromDBEntity;

  constructor(private activatedRoute: ActivatedRoute,
                      private router: Router,
                      private ptoService: PTOService,
                      private flexService: FlexService,
                      private flexTypeService: FlexTypeService,
                      public dialog: MatDialog)
  {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.parentUrl = event.url;
      }
    });
}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param =>
    {
      this.requestId = param.get('id');
      this.ptoService.getPTOById(this.requestId) 
        .toPromise().then((request: PTOFromDBEntity) =>
        {
          this.ptoRequest = request;
          this.isFlexRequest = (this.ptoRequest == null);
          if (this.isFlexRequest)
          {
            this.flexService.getFlexById(this.requestId)
              .toPromise().then((request: FlexFromDBEntity) =>
              {
                this.flexRequest = request;
                let flexTypeName = this.flexTypeService.getFlexTypeById(request.flexTypeId);

                this.isShiftSwap = (flexTypeName == "Shift Swap");
                this.isSelfShiftSwap = (flexTypeName == "Self-Shift Swap");
                this.isShiftSlide = (flexTypeName == "Shift Slide");
                this.isPreArrangedShiftSlide = (flexTypeName == "Pre-Arranged Shift Slide");
              });
          }
        });
    });
    this.displayRequestDialog();
  }

  displayRequestDialog()
  {
    let dialogConfig = CommonLibrary.CreateDialog();
    dialogConfig.id = "request-display";
    dialogConfig.height = (this.isSelfShiftSwap) ? "85%" : "75%";
    dialogConfig.width = "65%";
    this.dialogRef = this.dialog.open(RequestDisplayComponent, dialogConfig);
  }

  acceptRequest(flexId: string) {
    this.flexService.approveFlex(flexId);
  }

  declineRequest(flexId: string) {
    this.flexService.declineFlex(flexId);
  }

  onBack(): void {
    this.dialogRef.close();
    this.router.navigate([this.parentUrl]);
  }
}
