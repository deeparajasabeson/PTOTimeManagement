import { AbstractControl, ValidatorFn } from '@angular/forms';
import { StatusService } from "../_services/status.service";
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TeamFromDBEntity } from '../_entities/TeamFromDBEntity';

export function ValidateHours(allDay: boolean,
  startDate: NgbDateStruct,
  startTime: string,
  endDate: NgbDateStruct,
  endTime: string,
  team: TeamFromDBEntity
): ValidatorFn
{
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value <= 0 ) {
      return { 'valideOriginalHours': true };
    }
    return null;
  }
}


function calculateHours(allDay: boolean, startDate: NgbDateStruct, startTime: string, endDate: NgbDateStruct, endTime: string, team: TeamFromDBEntity) {
  let hours: number;
  if (startDate == endDate) {
    if (allDay) { hours = 8; } else {
      let iStartTime = parseInt(startTime);
      let iStartHour = Math.trunc(iStartTime);
      let iStartMin = iStartTime - iStartHour;

      let iEndTime = parseInt(endTime);

      hours = Math.trunc(iStartTime) 
    }
   
  }
  else {

  }
}

