import { inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { HttpClientModule } from '@angular/common/http';
import { StatusFromDBEntity } from '../_entities/StatusFromDBEntity';
import { StatusNamePipe } from './status-name.pipe';
import { StatusService } from '../_services/status.service';


describe('StatusNamePipe', () => {
  let mockStatusService;
  let pipe: StatusNamePipe;

  const STATUS_OBJECT: StatusFromDBEntity= {
    id: '6E19E05D-2050-4A5D-83FA-7D87E882AC6D',
    name: 'Pending',
    description: '',
    isActive: true, createdBy: '', createdOn: new Date(), updatedBy: '', updatedOn: new Date()
  };

  beforeEach(() => {
    mockStatusService = jasmine.createSpyObj<StatusService>(['getStatusById']);
    mockStatusService.getStatusById.and.returnValue(of(STATUS_OBJECT));

    TestBed.resetTestEnvironment();
    TestBed
      .initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
      .configureTestingModule({
        declarations: [],
        imports: [ HttpClientModule ],
        providers: [{ provide: StatusService, useValue: mockStatusService }]
      });
    const statusService: StatusService = TestBed.get(StatusService);   //Another way to create a service object
    pipe = new StatusNamePipe(statusService);
  });

  // Unit Tests
  it('create an instance',  () => {  
     expect(pipe).toBeTruthy();
  });

  it('should return statusname for statusId', inject([StatusService], (statusService: StatusService) => {  // a way to create and inject Service object  - we do not use it here
    expect(pipe.transform('6E19E05D-2050-4A5D-83FA-7D87E882AC6D')).toEqual('Pending');
  }));
});
