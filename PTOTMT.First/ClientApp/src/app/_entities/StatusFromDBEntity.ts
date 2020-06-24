// StatusFromDBEntity.ts
export interface StatusFromDBEntity {
  id: string,
  name: string,
  description: string,
  isActive: boolean,
  createdBy: string,
  createdOn: Date,
  updatedBy: string,
  updatedOn: Date
}
