// PTOEntity.ts
export interface PTOEntity {
  id: string,
  userId: string,
  description: string,
  requestTypeId: string,
  startDateTime: Date,
  endDateTime: Date,
  hours: number,
  allDay: boolean,
  statusId: string,
  quotaId: string,
  isActive: boolean,
  createdBy: string,
  createdOn: Date,
  updatedBy: string,
  updatedOn: Date
}
