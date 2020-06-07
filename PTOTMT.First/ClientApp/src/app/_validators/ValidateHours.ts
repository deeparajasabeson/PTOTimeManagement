import { AbstractControl, ValidatorFn } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export function ValidateHours(
  allDay: boolean,
  startDate: NgbDateStruct,
  startTime: string,
  endDate: NgbDateStruct,
  endTime: string,
): ValidatorFn
{
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let hours = calculateHours(allDay, startDate, startTime, endDate, endTime);
    if (control.value <= 0 || (hours != null && control.value != hours) ) {
      return { 'valideHours': true };
    }
    return null;
  }
}

//To calculate number of hours between  specifed dates and times
function calculateHours(
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
      hours = 8 * NoOfDays(startDate, endDate);
    }
    else {
      return null;
    }
  }
  return hours;
}

//function to calculate number of days inbetween two dates
function NoOfDays(startDate: NgbDateStruct, endDate: NgbDateStruct) : number{
  return Math.floor((
         Date.UTC(endDate.year, endDate.month, endDate.day)
      - Date.UTC(startDate.year, startDate.month, startDate.day)
    ) / (1000 * 60 * 60 * 24)
  );
}
