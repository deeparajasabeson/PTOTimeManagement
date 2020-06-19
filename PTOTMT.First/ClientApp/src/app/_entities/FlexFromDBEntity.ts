// FlexFromDBEntity.ts
export interface FlexFromDBEntity {
  id: string,
  userId: string,
  flexTypeId: string,
  description: string,
  isForward: boolean,
  startDateTime: string,
  endDateTime: string,
  hours: number,
  isActive: boolean,
  createdBy: string,
  createdOn: string,
  updatedBy: string,
  updatedOn: string
}
