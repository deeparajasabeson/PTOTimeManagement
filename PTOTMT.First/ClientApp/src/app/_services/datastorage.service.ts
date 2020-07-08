import { Injectable } from '@angular/core';
import { UserFromDBEntity } from '../_entities/UserFromDBEntity';
import { StatusFromDBEntity } from '../_entities/StatusFromDBEntity';
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

  private statusEntity: StatusFromDBEntity;
  setStatusEntity(value: StatusFromDBEntity) {
    this.statusEntity = value;
  }
  getStatusEntity(): StatusFromDBEntity {
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
