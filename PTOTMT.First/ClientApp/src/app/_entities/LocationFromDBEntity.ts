// LocationFromDBEntity.ts
export interface LocationFromDBEntity {
  id: string,
  name: string,
  description: string,
  isActive: boolean,
  createdBy: string,
  createdOn: Date,
  updatedBy: string,
  updatedOn: Date
}
