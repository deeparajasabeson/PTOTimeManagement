import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { ErrorDialogData } from '../_viewmodels/ErrorDialogData';


@Injectable({
  providedIn: 'root'
})

export class ErrorDialogService {
  constructor(public dialog: MatDialog) { }
  openDialog(dialogdata: ErrorDialogData ): any {
     const dialogRef = this.dialog.open(ErrorDialogComponent, {
      width: '35%',
      disableClose: true,
      autoFocus: true,
       data: dialogdata
     });
  }
}
