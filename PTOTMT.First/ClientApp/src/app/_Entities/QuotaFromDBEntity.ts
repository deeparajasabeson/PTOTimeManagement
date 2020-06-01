// QuotaEntity.ts
export interface QuotaFromDBEntity {
  id: string,
  name: string,
  description: string,
  startDateTime: string,
  endDateTime: string,
  originalHours: number,
  remainingHours: number,
  teamId: string,
  isActive: boolean,
  createdBy: string,
  createdOn: string,
  updatedBy: string,
  updatedOn: string
}
