import { ApiAuthorizationModule } from './api-authorization.module';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

describe('ApiAuthorizationModule', () => {
  let apiAuthorizationModule: ApiAuthorizationModule;
  let library: FaIconLibrary;

  beforeEach(() => {
    apiAuthorizationModule = new ApiAuthorizationModule(this.library): ApiAuthorizationModule;
  });

  it('should create an instance', () => {
    expect(apiAuthorizationModule).toBeTruthy();
  });
});
