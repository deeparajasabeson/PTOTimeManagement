import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogConfig } from '@angular/material/dialog';

export class CommonLibrary
{
    //Convert NgbDateStruct date to Date format
    static NgbDateStruct2Date(date: NgbDateStruct): Date {
    return new Date(date.year, date.month, date.day);
  }

  //Convert NgbDateStruct Date and Time string to  Date Format
  static NgbDateStruct2DateTime(date: NgbDateStruct, time: string): Date {
    return new Date(
      date.year,
      date.month - 1,
      date.day,
      parseInt(time.substr(0, 2)),
      parseInt(time.substr(3, 2))
    );
  }

  //Convert Date to NgbDateStruct format
  static Date2NgbDateStruct(date: Date): NgbDateStruct {
    let toDate: NgbDateStruct = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
    return toDate;
  }

  //Generating GUID in Typescript
  static GenerateUUID() {
    var d = new Date().getTime();
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16; //random number between 0 and 16
      if (d > 0) {  //Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {  //Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  // Check whether User is authenticated
  static IsUserAuthenticated(): boolean {
    let token: string = localStorage.getItem("jwt");
    return (token) ? true : false;
  }

  static CreateDialog() : MatDialogConfig{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;   // User can't close the dialog by clicking outside its body
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    return dialogConfig;
  }

  //convert the list to a sortedarray on the parameter given
  static sortListByProperty<T>(list: T[], propName: string): T[] {
    return list.sort((a, b) => {
      if (a[propName] < b[propName]) { return -1; }
      if (a[propName] > b[propName]) { return 1; }
      return 0;
    });
  }
}
