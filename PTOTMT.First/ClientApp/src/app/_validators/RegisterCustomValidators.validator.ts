import { AbstractControl,  ValidatorFn } from '@angular/forms';

export class RegisterCustomValidators {

  static MustMatchPassword(password: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {

      const confirmPassword = control.get('confirmPassword').value;
      if (password != confirmPassword) {
        return { 'invalidPassword': true };
      }
      return null;
    }
  }
}
