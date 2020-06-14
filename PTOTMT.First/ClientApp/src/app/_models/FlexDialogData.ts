// FlexDialogData.ts
export interface FlexDialogData {
  id: string;
  userId: string;
  requestTypeId: string;
  description: string;
  hours: number;
  minutes: number;
  allDay: boolean;
  startTime: string;
  endTime: string;
  quotaId: string;
  statusId: string;
  isNewEvent: boolean;
}
