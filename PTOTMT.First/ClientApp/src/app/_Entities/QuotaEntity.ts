// QuotaEntity.ts
export interface QuotaEntity {
  id: string,
  name: string,
  description: string,
  startDateTime: Date,
  endDateTime: Date,
  originalHours: number,
  remainingHours: number,
  teamId: string,
  isActive: boolean,
  createdBy: string,
  createdOn: Date,
  updatedBy: string,
  updatedOn: Date
}
