import { AbstractControl } from '@angular/forms';

export function ValidateMinutes(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value != 0 && control.value != 30 ) {
      return { 'valideMinutes': true };
    }
    return null;
  }

