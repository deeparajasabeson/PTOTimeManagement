// QuotaEntity.ts
export interface QuotaEntity {
  Id: string,
  Name: string,
  Description: string,
  StartDateTime: Date,
  EndDateTime: Date,
  OriginalHours: number,
  RemainingHours: number,
  TeamId: string,
  IsActive: boolean,
  CreatedBy: string,
  CreatedOn: Date,
  UpdatedBy: string,
  UpdatedOn: Date
}
