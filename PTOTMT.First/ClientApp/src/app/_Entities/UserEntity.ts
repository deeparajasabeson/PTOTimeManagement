// UserEntity.ts
export interface UserEntity {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  titleId: string;
  ntLogin: string;
  emailAddress: string;
  roleId: string
  reportToUserId: string;
  locationId: string;
  teamFunctionId: string;
  isActive: boolean;
  createdBy: string;
  createdOn: Date;
  updatedBy: string;
  updatedOn: Date;
}
