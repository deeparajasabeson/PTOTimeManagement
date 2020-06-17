import { AbstractControl,  ValidatorFn } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class FlexCustomValidators {

  static ValidateHours(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {

      const startTime = control.get('startTime').value;
      const endTime = control.get('endTime').value;
      const hours = control.get('hours').value;
      const minutes = control.get('minutes').value;

      let calchours = this.calculateHours(startTime,  endTime);

      if (hours != null && minutes != null && calchours != hours+minutes/100) {
        return { 'invalidHours': true };
      }
      return null;
    }
  }

  //To calculate number of hours between  specifed dates and times
  static calculateHours(
    startTime: string,
    endTime: string,
  ): number {
    let hours: number = 0;
    let iStartTime = parseInt(startTime);
    let iEndTime = parseInt(endTime);
    let iStartHour = Math.trunc(iStartTime);
    let iStartMin = iStartTime - iStartHour;
    let iEndHour = Math.trunc(iEndTime);
    let iEndMin = iEndTime - iEndHour;
    hours = (iEndHour - iStartHour) + (iEndMin - iStartMin);
    return hours;
  }
}
