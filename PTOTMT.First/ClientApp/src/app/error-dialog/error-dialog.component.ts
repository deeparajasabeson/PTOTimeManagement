import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorDialogData } from '../_models/ErrorDialogData';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html'
})
export class ErrorDialogComponent {
  constructor(private dialogRef: MatDialogRef<ErrorDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogdata: ErrorDialogData) { }

  public closeMe(event: any): void {
    event.stopPropogation();
    this.dialogRef.close();
  }
}
