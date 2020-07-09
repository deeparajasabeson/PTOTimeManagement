import { TestBed, inject } from '@angular/core/testing';
import { DataStorageService } from './datastorage.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserFromDBEntity } from '../_entities/UserFromDBEntity';
import { StatusFromDBEntity } from '../_entities/StatusFromDBEntity';
import { TeamFromDBEntity } from '../_entities/TeamFromDBEntity';

describe('DataStorageService', () => {
  let dataStorageService: DataStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ DataStorageService ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    dataStorageService = new DataStorageService();//TestBed.get(LocationService);
  });

  it('should be created', () => {
    expect(dataStorageService).toBeTruthy();
  });

  it('should set the Option', () => {
    dataStorageService.setOption(0, 25);
    expect(dataStorageService.getOption()[0]).toBe(25);
  });

  it('should set the UserEntity', () => {
    let userEntity: UserFromDBEntity = {
      id: '6E19E05D-2050-4A5D-83FA-7D87E882AC6D',
      firstName: 'Deepa',
      lastName: 'Rajasabeson',
      userName: '', password: '', ntLogin: '', emailAddress: '', roleId: '', reportToUserId: '', locationId: '', teamId: '',
      isActive: true,
      createdBy: '', createdOn: new Date(), updatedBy: '', updatedOn: new Date()
    };
    dataStorageService.setUserEntity(userEntity);
    expect(dataStorageService.getUserEntity()).toBe(userEntity);
  });

  it('should set the StatusEntity', () => {
    let statusEntity: StatusFromDBEntity = {
      id: '6E19E05D-2050-4A5D-83FA-7D87E882AC6D',
      name: 'Pending',
      description: '',
      isActive: true, createdBy: '', createdOn: new Date(), updatedBy: '', updatedOn: new Date()
    };
    dataStorageService.setStatusEntity(statusEntity);
    expect(dataStorageService.getStatusEntity()).toBe(statusEntity);
  });

  it('should set the TeamEntity', () => {
    let teamEntity: TeamFromDBEntity = {
      id: '6E19E05D-2050-4A5D-83FA-7D87E882AC6D',
      name: 'Help Desk',
      description: '',  isLeadership: false, maxShiftSlideHours: 3, shiftStartTimeLimit: 9, shiftEndTimeLimit: 18,
      isActive: true, createdBy: '', createdOn: new Date(), updatedBy: '', updatedOn: new Date()
    };
    dataStorageService.setTeamEntity(teamEntity);
    expect(dataStorageService.getTeamEntity()).toBe(teamEntity);
  });
});
