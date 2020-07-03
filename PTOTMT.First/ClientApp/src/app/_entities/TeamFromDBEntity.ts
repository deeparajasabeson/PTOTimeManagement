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
  createdOn: string,
  updatedBy: string,
  updatedOn: string
}
