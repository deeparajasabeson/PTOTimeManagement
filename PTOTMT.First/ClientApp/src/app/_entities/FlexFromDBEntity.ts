// FlexFromDBEntity.ts
export interface FlexFromDBEntity {
  id: string,
  userId: string,
  flexTypeId: string,
  name: string,
  description: string,
  isForward: boolean,
  startDateTime: string,
  endDateTime: string,
  hours: number,
  coWorkerId: string,
  coWorkerFlexId: string,
  anotherStartDateTime: string,
  anotherEndDateTime: string,
  statusId: string,
  isActive: boolean,
  createdBy: string,
  createdOn: Date,
  updatedBy: string,
  updatedOn: Date
}
