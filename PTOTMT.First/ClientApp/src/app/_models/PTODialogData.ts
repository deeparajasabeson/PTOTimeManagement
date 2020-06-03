import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
// PTODialogData.ts
export interface PTODialogData {
  id: string;
  userId: string;
  requestTypeId: string;
  description: string;
  hours: number;
  allDay: boolean;
  startDate: NgbDateStruct;
  startTime: string;
  endDate: NgbDateStruct;
  endTime: string;
}
