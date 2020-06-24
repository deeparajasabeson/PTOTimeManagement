import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FlexFromDBEntity } from '../_entities/FlexFromDBEntity';
import { PTOFromDBEntity } from '../_entities/PTOFromDBEntity';

@Injectable()
export class DataSharingService {
  public isUserAuthenticated: BehaviorSubject<boolean>               = new BehaviorSubject<boolean>(false);
  public userRequestList: BehaviorSubject<PTOFromDBEntity[]>  = new BehaviorSubject<PTOFromDBEntity[]>(null);
  public userFlexList: BehaviorSubject<FlexFromDBEntity[]>         = new BehaviorSubject<FlexFromDBEntity[]>(null);
  public teamRequestList: BehaviorSubject<PTOFromDBEntity[]> = new BehaviorSubject<PTOFromDBEntity[]>(null);
  public teamFlexList: BehaviorSubject<FlexFromDBEntity[]>        = new BehaviorSubject<FlexFromDBEntity[]>(null);
}
