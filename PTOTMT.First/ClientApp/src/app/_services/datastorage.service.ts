/// <reference path="flex.service.ts" />
import { Injectable } from '@angular/core';
import { UserFromDBEntity } from '../_entities/UserFromDBEntity';
import { StatusEntity } from '../_entities/StatusEntity';
import { QuotaEntity } from '../_entities/QuotaEntity';
import { TeamFromDBEntity } from '../_entities/TeamFromDBEntity';


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
  getStatusEntity(): StatusEntity {
    return this.statusEntity;
  }

  private userEntity: UserFromDBEntity;
  setUserEntity(value: UserFromDBEntity) {
    this.userEntity = value;
  }
  getUserEntity(): UserFromDBEntity {
    return this.userEntity;
  }

  private teamEntity: TeamFromDBEntity;
  setTeamEntity(value: TeamFromDBEntity) {
    this.teamEntity = value;
  }
  getTeamEntity(): TeamFromDBEntity {
    return this.teamEntity;
  }

  private details = {};
    setOption(option, value) {
    this.details[option] = value;
  }
    getOption() {
    return this.details;
  }
}  
