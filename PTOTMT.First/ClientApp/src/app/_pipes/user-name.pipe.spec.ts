import { inject, TestBed } from '@angular/core/testing';
import { UserNamePipe } from './user-name.pipe';
import { UserService } from '../_services/user.service';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { HttpClientModule } from '@angular/common/http';
import { UserFromDBEntity } from '../_entities/UserFromDBEntity';
import { of } from 'rxjs';


describe('UserNamePipe', () => {
  let mockUserService;
  let pipe: UserNamePipe;

  const USER_OBJECT : UserFromDBEntity= {
    id: '6E19E05D-2050-4A5D-83FA-7D87E882AC6D',
    firstName: 'Deepa',
    lastName: ' Rajasabeson',
    userName: '', password: '', ntLogin: '', emailAddress: '', roleId: '', reportToUserId: '', locationId: '', teamId: '',
    isActive: true,
    createdBy: '', createdOn: '', updatedBy: '', updatedOn: ''
  };

  beforeEach(() => {
    mockUserService = jasmine.createSpyObj<UserService>(['getUserById']);
    mockUserService.getUserById.and.returnValue(of(USER_OBJECT));

    TestBed.resetTestEnvironment();
    TestBed
      .initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
      .configureTestingModule({
        declarations: [],
        imports: [ HttpClientModule ],
        providers: [{ provide: UserService, useValue : mockUserService }]
      });
    const userService: UserService = TestBed.get(UserService);   //Another way to create a service object
    pipe = new UserNamePipe(userService);
  });

  // Unit Tests
  it('create an instance',  () => {  
     expect(pipe).toBeTruthy();
  });

  it('should return username for userId', inject([UserService], (userService: UserService) => {  // a way to create and inject Service object  - we do not use it here
    expect(pipe.transform('6E19E05D-2050-4A5D-83FA-7D87E882AC6D')).toEqual('');
  }));
});
