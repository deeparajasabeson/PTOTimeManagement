// PTOEntity.ts
export interface PTOFromDBEntity {
  id: string,
  userId: string,
  requestTypeId: string,
  description: string,
  startDateTime: string,
  endDateTime: string,
  hours: number,
  statusId: string,
  quotaId: string,
  isActive: boolean,
  createdBy: string,
  createdOn: string,
  updatedBy: string,
  updatedOn: string
}
