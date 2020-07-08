import { inject, TestBed } from '@angular/core/testing';
import { FlexTypeNamePipe } from './flextype-name.pipe';
import { FlexTypeService } from '../_services/flextype.service';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { HttpClientModule } from '@angular/common/http';
import { FlexTypeFromDBEntity } from '../_entities/FlexTypeFromDBEntity';


describe('FlexTypeNamePipe', () => {
  let mockFlexTypeService;
  let pipe: FlexTypeNamePipe;

  const FLEXTYPE_OBJECT : FlexTypeFromDBEntity= {
    id: '6E19E05D-2050-4A5D-83FA-7D87E882AC6D',
    name: 'Shift Swap',
    description: '', isActive: true, createdBy: '', createdOn: new Date(), updatedBy: '', updatedOn: new Date()
  };

  beforeEach(() => {
    mockFlexTypeService = jasmine.createSpyObj<FlexTypeService>(['getFlexTypeById']);
    mockFlexTypeService.getFlexTypeById.and.returnValue(FLEXTYPE_OBJECT.name);

    TestBed.resetTestEnvironment();
    TestBed
      .initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
      .configureTestingModule({
        declarations: [],
        imports: [ HttpClientModule ],
        providers: [{ provide: FlexTypeService, useValue : mockFlexTypeService }]
      });
    const flextypeService: FlexTypeService = TestBed.get(FlexTypeService);   //Another way to create a service object
    pipe = new FlexTypeNamePipe(flextypeService);
  });

  // Unit Tests
  it('create an instance',  () => {  
     expect(pipe).toBeTruthy();
  });

  it('should return flextypename for flextypeId', inject([FlexTypeService], (flextypeService: FlexTypeService) => {
    // a way to create and inject Service object - we do not use it here
    expect(pipe.transform('6E19E05D-2050-4A5D-83FA-7D87E882AC6D')).toEqual('Shift Swap');
  }));
});
