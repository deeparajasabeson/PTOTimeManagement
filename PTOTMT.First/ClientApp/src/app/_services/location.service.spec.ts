import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { CommonLibrary } from '../_library/common.library';
import { LocationService } from './location.service';
import { LocationFromDBEntity } from '../_entities/LocationFromDBEntity';

describe('DatasharingService', () => {
  let http: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj('HttpClient', ['get']);
  let locationService: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationService]
    });
    locationService = TestBed.get(LocationService);
  });

  it('should be created', inject([LocationService], (service: LocationService) => {
    expect(service).toBeTruthy();
  }));

  it('should get locations', () => {
    const locations: LocationFromDBEntity[] = [{
      id: '',
      name: 'Nashville',
      description: 'Nashville Office',
      isActive: true,
      createdBy: '',
      createdOn: new Date(),
      updatedBy: '',
      updatedOn: new Date()
    }, {
      id: '',
      name: 'Atlanta',
      description: 'Atlanta Head Office',
      isActive: true,
      createdBy: '',
      createdOn: new Date(),
      updatedBy: '',
      updatedOn: new Date()
    }];
    http.get.and.returnValue(of(locations));
    locationService.getLocations().subscribe(result => {
      expect(result.length).toEqual(2);
    });
  });

  it('should get location by id', () => {
    let locationId: string = CommonLibrary.GenerateUUID();
    const location: LocationFromDBEntity= {
      id: locationId,
      name: 'Atlanta',
      description: 'Atlanta Head Office',
      isActive: true,
      createdBy: '',
      createdOn: new Date(),
      updatedBy: '',
      updatedOn: new Date()
    }
    http.get.and.returnValue(of(location));
    locationService.getLocationById(location.id).subscribe(result => {
      expect(result.name).toEqual('Atlanta');
    });
  })
});
