// FlexEntity.ts
export interface FlexEntity {
  id: string,
  userId: string,
  description: string,
  flexId: string,
  startDateTime: Date,
  endDateTime: Date,
  hours: number,
  isActive: boolean,
  createdBy: string,
  createdOn: Date,
  updatedBy: string,
  updatedOn: Date
}
