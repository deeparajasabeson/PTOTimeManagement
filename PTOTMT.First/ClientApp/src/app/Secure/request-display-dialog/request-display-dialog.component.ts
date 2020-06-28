import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { PTOService } from '../../_services/pto.service';
import { FlexService } from '../../_services/flex.service';
import { RequestDisplayDialogData } from '../../_viewmodels/RequestDisplayDialogData';

@Component({
  selector: 'app-request-display-dialog',
  templateUrl: './request-display-dialog.component.html',
  styleUrls: ['./request-display-dialog.component.css']
})
export class RequestDisplayDialogComponent {
  @Input() public data: RequestDisplayDialogData;  
  parentUrl: string;

  constructor(  private dialogRef: MatDialogRef<RequestDisplayDialogComponent>,
                        @Inject(MAT_DIALOG_DATA) dataFromParent: RequestDisplayDialogData,
                        private ptoService: PTOService,
                        private flexService: FlexService,
                        private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.parentUrl = event.url;
      }
    });
  }

  onBack(): void {
    this.dialogRef.close();
    this.router.navigate([this.parentUrl]);
  }

  approvePTO(ptoId: string) {
    this.ptoService.approvePTO(ptoId);
  }

  approveFlex(flexId: string) {
    this.flexService.approveFlex(flexId);
  }

  declinePTO(flexId: string) {
    this.flexService.declineFlex(flexId);
  }

  declineFlex(flexId: string) {
    this.flexService.declineFlex(flexId);
  }
}
