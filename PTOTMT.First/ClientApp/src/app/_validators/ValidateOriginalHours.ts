import { AbstractControl, ValidatorFn  } from '@angular/forms';

export function ValidateOriginalHours(remainingHours: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if ( control.value <= 0 || control.value < remainingHours ) {
      return { 'valideOriginalHours': true };
    }
    return null;
  }
}
