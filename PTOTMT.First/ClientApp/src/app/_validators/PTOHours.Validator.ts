import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class PTOCustomValidators {

  static ValidateHours(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {

      const allDay = control.get('allDay').value;
      const startDate = control.get('startDate').value;
      const startTime = control.get('startTime').value;
      const endDate = control.get('endDate').value;
      const endTime = control.get('endTime').value;
      const hours = control.get('hours').value;

      let calchours = this.calculateHours(allDay, startDate, startTime, endDate, endTime);

      if (hours != null && calchours != hours) {
        return { 'invalidHours': true };
      }
      return null;
    }
  }

  //To calculate number of hours between  specifed dates and times
  static calculateHours(
    allDay: boolean,
    startDate: NgbDateStruct,
    startTime: string,
    endDate: NgbDateStruct,
    endTime: string,
  ): number {
    let hours: number = 0;
    let iStartTime = parseInt(startTime);
    let iEndTime = parseInt(endTime);
    if (startDate == endDate) {
      if (allDay) {
        hours = 8;
      }
      else {
        let iStartHour = Math.trunc(iStartTime);
        let iStartMin = iStartTime - iStartHour;
        let iEndHour = Math.trunc(iEndTime);
        let iEndMin = iEndTime - iEndHour;
        hours = (iEndHour - iStartHour) + (iEndMin - iStartMin);
      }
    }
    else {
      if (allDay) {
        hours = 8 * this.NoOfDays(startDate, endDate);
      }
      else {
        return null;
      }
    }
    return hours;
  }

  //function to calculate number of days inbetween two dates
  static NoOfDays(startDate: NgbDateStruct, endDate: NgbDateStruct) : number{
    return Math.floor((
           Date.UTC(endDate.year, endDate.month, endDate.day)
        - Date.UTC(startDate.year, startDate.month, startDate.day)
      ) / (1000 * 60 * 60 * 24)
    );
  }
}
