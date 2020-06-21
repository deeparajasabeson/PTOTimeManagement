import { AbstractControl,  ValidatorFn } from '@angular/forms';
import { TeamFromDBEntity } from '../_entities/TeamFromDBEntity';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CommonLibrary } from '../_library/common.library';
import { FlexTypeFromDBEntity } from '../_entities/FlexTypeFromDBEntity';


export class FlexCustomValidators {

  static ValidateData(team: TeamFromDBEntity, flexTypes: FlexTypeFromDBEntity[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const startTime = control.get('startTime').value;
      const endTime = control.get('endTime').value;
      const hours = control.get('hours').value;
      const minutes = control.get('minutes').value;
      const flexTypeId = control.get('flexTypeId').value;
      const flexTypeValue = control.get('flexTypeValue').value;

      //Validate Times  for Shift Slide and Pre-Arranged Shift Slide Flextypes
      if (flexTypeValue == "Shift Slide" || flexTypeValue == "Pre-Arranged Shift Slide") {
        //Validate Minutes
        if (minutes != 0 && minutes != 30) {
          return { 'invalidMinutes': true };
        }
        let diffTime = 0;
        if (control.get('isForward').value) {
          if (parseInt(endTime) <= team.shiftEndTimeLimit) {
            diffTime = this.diffTime(endTime, team.shiftEndTimeLimit);
          } else {
            return { 'invalidTime': true };
          }
        } else {
          if (parseInt(startTime) >= team.shiftStartTimeLimit) {
            diffTime = this.diffTime(startTime, team.shiftStartTimeLimit);
          }
          else {
            return { 'invalidTime': true };
          }
        }

        //Validate Hours
        if (hours != null && minutes != null) {
          const originalHours = hours + minutes / 100;
          if (diffTime > originalHours || originalHours > team.maxShiftSlideHours) {
            return { 'invalidHours': true };
          }
        }
      }

      //Validate Date
      let flexTypeName = "";
      if ((flexTypes != null || flexTypes != undefined) && flexTypeId != "") {
        flexTypeName= flexTypes.find(ft => ft.id == flexTypeId).name;
      }
      const date: NgbDateStruct = control.get('onDate').value;
      const onDate = CommonLibrary.NgbDateStruct2Date(date);
      
      const toDay = new Date();   // Today's Date

      // For Shift Swap Flextype
      if (flexTypeName == 'Shift Swap') {
        const coWorkerId = control.get('coWorkerId').value;
        const coWorkerDate = control.get('coWorkerDate').value;
        const coWorkerStartTime = control.get('coWorkerStartTime').value;
        const coWorkerEndTime = control.get('coWorkerEndTime').value;
        if (coWorkerId == null || coWorkerId == undefined || coWorkerId == "") {
          return { 'inValidCoWorker': true };
        }
        if (coWorkerDate >= toDay) {
          return { 'notFutureCoWorkerDate': true };
        }
        if (coWorkerStartTime > coWorkerEndTime) {
          return { 'inValidCoWorkerTime': true };
        }
      }

      // applied for all Flex Types
      if (onDate >= toDay) {   
        if (flexTypeName == 'Pre-Arranged Shift Slide') {
          let diff = onDate.getTime() - toDay.getTime();
          let days = Math.round(Math.abs(diff / (1000 * 60 * 60 * 24)));

          if (days >= 3) {
            return null;
          }
          else {
            return { 'diffNot3Days': true };
          }
        }
        else {
          return null;
        }
      }
      else {
        return { 'notFutureDate': true };
      }
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
}
