import { AbstractControl,   ValidatorFn } from '@angular/forms';
import { PTOCustomValidators } from './PTOHours.Validator';

export class QuotaCustomValidators {

  static ValidateOriginalHours(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const startDate = control.get('startDate').value;
      const startTime = control.get('startTime').value;
      const endDate = control.get('endDate').value;
      const endTime = control.get('endTime').value;
      const remainingHours = control.get('remainingHours').value;
      const originalHours = control.get('originalHours').value;

      let calchours = PTOCustomValidators.calculateHours(false, startDate, startTime, endDate, endTime);

      if (originalHours != null && originalHours <= 0) {
        return { 'invalidHours': true };
      }
      if (calchours < originalHours) {
        return { 'hoursExceeding': true };
      }
      if (originalHours < remainingHours) {
        return { 'remainingHoursGreater': true };
      }
      return null;
    }
  }


}
