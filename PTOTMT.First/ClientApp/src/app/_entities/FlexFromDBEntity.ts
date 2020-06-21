// FlexFromDBEntity.ts
export interface FlexFromDBEntity {
  id: string,
  userId: string,
  flexTypeId: string,
  name: string;
  description: string,
  isForward: boolean,
  startDateTime: string,
  endDateTime: string,
  hours: number,
  coWorkerId: string;
  anotherStartDateTime: string,
  anotherEndDateTime: string,
  isActive: boolean,
  createdBy: string,
  createdOn: string,
  updatedBy: string,
  updatedOn: string
}
