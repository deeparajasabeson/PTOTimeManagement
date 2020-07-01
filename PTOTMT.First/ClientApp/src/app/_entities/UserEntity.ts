// UserEntity.ts
export interface UserEntity {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  ntLogin: string;
  emailAddress: string;
  roleId: string
  reportToUserId: string;
  locationId: string;
  teamId: string;
  isActive: boolean;
  createdBy: string;
  createdOn: Date;
  updatedBy: string;
  updatedOn: Date;
}
