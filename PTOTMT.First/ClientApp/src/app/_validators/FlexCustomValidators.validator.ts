import { AbstractControl,  ValidatorFn } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TeamFromDBEntity } from '../_entities/TeamFromDBEntity';

export class FlexCustomValidators {

  static ValidateHours(team: TeamFromDBEntity): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {

      const startTime = control.get('startTime').value;
      const endTime = control.get('endTime').value;
      const hours = control.get('hours').value;
      const minutes = control.get('minutes').value;

      let diffTime;
      if (control.get('isForward').value) {
        if (parseInt(endTime) <= team.shiftEndTimeLimit) {
          diffTime = this.diffTime(endTime, team.shiftEndTimeLimit);
        } else {
          return {'invalidTime': true};
        }
      } else {
        if (parseInt(startTime) >= team.shiftStartTimeLimit) {
          diffTime = this.diffTime(startTime, team.shiftStartTimeLimit);
        }
        else {
          return { 'invalidTime': true };
        }
      }

      if (hours != null && minutes != null && diffTime > hours+minutes/100) {
        return { 'invalidHours': true };
      }
      return null;
    }
  }

  //To calculate number of hours between  specifed dates and times
  static diffTime(
    time: string,
    range: number,
  ): number {
    let iTime = parseInt(time);
    let iStartHours = Math.trunc(iTime);
    let iStartMinutes = iTime - iStartHours;
    let iEndHours = Math.trunc(range);
    let iEndMinutes = range - iEndHours;
    if (iTime > range) {
      return (iEndHours - iStartHours) + (iEndMinutes - iStartMinutes);
    }
    else {
      return (iStartHours - iEndHours) + (iStartMinutes - iEndMinutes);
    }
  }

  static ValidateFlexMinutes(team: TeamFromDBEntity): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const hours = control.get('hours').value;
      const minutes = control.get('minutes').value;
      if (minutes == 0 || (minutes == 30 && hours < team.maxShiftSlideHours)) {
        return null;
      }
     return { 'invalidMinutes': true };
    }
  }
}
