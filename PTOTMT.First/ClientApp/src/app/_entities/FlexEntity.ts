// FlexEntity.ts
export interface FlexEntity {
  id: string,
  userId: string,
  flexTypeId: string,
  name: string,
  description: string,
  isForward: boolean,
  startDateTime: Date,
  endDateTime: Date,
  hours: number,
  coWorkerId: string,
  anotherStartDateTime: Date,
  anotherEndDateTime: Date,
  statusId: string,
  isActive: boolean,
  createdBy: string,
  createdOn: Date,
  updatedBy: string,
  updatedOn: Date
}
