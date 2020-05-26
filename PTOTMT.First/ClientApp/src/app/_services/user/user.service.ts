import { Injectable } from '@angular/core';
import { UserEntity } from '../../_entities/UserEntity';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userEntity: UserEntity;
  setUserEntity(value: UserEntity) {
    this.userEntity = value;
  }
  getUserEntity(): UserEntity {
    return this.userEntity;
  }

  private details = {};
    setOption(option, value) {
    this.details[option] = value;
  }
    getOption() {
    return this.details;
  }
}  
