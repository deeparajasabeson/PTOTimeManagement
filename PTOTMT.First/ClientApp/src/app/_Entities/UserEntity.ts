// UserEntity.ts
export interface UserEntity {
  Id: string;
  FirstName: string;
  LastName: string;
  UserName: string;
  Password: string;
  TitleId: string;
  NTLogin: string;
  EmailAddress: string;
  RoleId: string
  ReportToUserId: string;
  LocationId: string;
  TeamFunctionId: string;
  IsActive: boolean;
  CreatedBy: string;
  CreatedOn: Date;
  UpdatedBy: string;
  UpdatedOn: Date;
}
