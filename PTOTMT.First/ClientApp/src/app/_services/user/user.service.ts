import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private details = {};

  setOption(option, value) {
    this.details[option] = value;
  }

  getOption() {
    return this.details;
  }
}  
