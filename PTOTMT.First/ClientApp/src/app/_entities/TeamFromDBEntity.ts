// TeamFromDBEntity.ts
export interface TeamFromDBEntity {
  id: string,
  name: string,
  description: string,
  isLeadership: boolean,
  maxShiftSlideHours: number,
  shiftStartTimeLimit: number,
  shiftEndTimeLimit: number,
  isActive: boolean,
  createdBy: string,
  createdOn: Date,
  updatedBy: string,
  updatedOn: Date
}
