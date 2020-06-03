import { Injectable } from '@angular/core';
import { UserEntity } from '../_entities/UserEntity';
import { StatusEntity } from '../_entities/StatusEntity';
import { QuotaEntity } from '../_entities/QuotaEntity';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private quotas: QuotaEntity[];
  setQuotaEntityList(value: QuotaEntity[]) {
    this.quotas = value;
  }
  getQuotaEntityList(): QuotaEntity[] {
    return this.quotas;
  }

  private statusEntity: StatusEntity;
  setStatusEntity(value: StatusEntity) {
    this.statusEntity = value;
  }
  getUserEntity(): UserEntity {
    return this.userEntity;
  }

  private userEntity: UserEntity;
  setUserEntity(value: UserEntity) {
    this.userEntity = value;
  }
  getStatusEntity(): StatusEntity {
    return this.statusEntity;
  }

  private details = {};
    setOption(option, value) {
    this.details[option] = value;
  }
    getOption() {
    return this.details;
  }
}  
