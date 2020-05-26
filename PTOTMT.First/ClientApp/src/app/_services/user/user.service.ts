import { Injectable } from '@angular/core';
import { UserEntity } from '../../_entities/UserEntity';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user;
  setUser(value) {
    this.user = value;
  }
  getUser() {
    return this.user;
  }

  private details = {};
    setOption(option, value) {
    this.details[option] = value;
  }
    getOption() {
    return this.details;
  }
}  
