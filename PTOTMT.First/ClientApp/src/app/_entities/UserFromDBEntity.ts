// UserFromDBEntity.ts
export interface UserFromDBEntity {
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
  createdOn: string;
  updatedBy: string;
  updatedOn: string;
}
