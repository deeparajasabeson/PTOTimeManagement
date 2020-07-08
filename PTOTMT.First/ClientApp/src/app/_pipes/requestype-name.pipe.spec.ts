import { inject, TestBed } from '@angular/core/testing';
import { RequestTypeNamePipe } from './requestType-name.pipe';
import { RequestTypeService } from '../_services/requestType.service';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { HttpClientModule } from '@angular/common/http';
import { RequestTypeFromDBEntity } from '../_entities/RequestTypeFromDBEntity';
import { of } from 'rxjs';


describe('RequestTypeNamePipe', () => {
  let mockRequestTypeService;
  let pipe: RequestTypeNamePipe;

  const REQUESTTYPE_OBJECT : RequestTypeFromDBEntity= {
    id: '6E19E05D-2050-4A5D-83FA-7D87E882AC6D',
    name: 'Jury Duty',
    description: '', isActive: true, createdBy: '', createdOn: new Date(), updatedBy: '', updatedOn: new Date()
  };

  beforeEach(() => {
    mockRequestTypeService = jasmine.createSpyObj<RequestTypeService>(['getRequestTypeById']);
    mockRequestTypeService.getRequestTypeById.and.returnValue(of(REQUESTTYPE_OBJECT));

    TestBed.resetTestEnvironment();
    TestBed
      .initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
      .configureTestingModule({
        declarations: [],
        imports: [ HttpClientModule ]
      });
      pipe = new RequestTypeNamePipe(mockRequestTypeService);
  });

  // Unit Tests
  it('create an instance',  () => {  
     expect(pipe).toBeTruthy();
  });

  it('should return requestTypename for requestTypeId', inject([RequestTypeService], (requestTypeService: RequestTypeService) => {
    // a way to create and inject Service object  - we do not use it here
    expect(pipe.transform('6E19E05D-2050-4A5D-83FA-7D87E882AC6D')).toEqual('Jury Duty');
  }));
});
