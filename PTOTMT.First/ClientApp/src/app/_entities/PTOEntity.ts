// PTOEntity.ts
export interface PTOEntity {
  id: string,
  userId: string,
  description: string,
  startDateTime: Date,
  endDateTime: Date,
  hours: number,
  statusId: string,
  quotaId: string,
  isActive: boolean,
  createdBy: string,
  createdOn: Date,
  updatedBy: string,
  updatedOn: Date
}
