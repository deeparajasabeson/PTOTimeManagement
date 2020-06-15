import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
// QuotaDialogData.ts
export interface QuotaDialogData {
  id: string;
  quotaName: string;
  originalHours: number;
  minutes: number;
  remainingHours: number;
  startDate: NgbDateStruct;
  startTime: string;
  endDate: NgbDateStruct;
  endTime: string;
  description: string;
  isNewEvent: boolean;
}
