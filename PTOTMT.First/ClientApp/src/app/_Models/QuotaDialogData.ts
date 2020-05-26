import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
// QuotaDialogData.ts
export interface QuotaDialogData {
  quotaName: string;
  hours: number;
  startDate: NgbDateStruct;
  startTime: string;
  endDate: NgbDateStruct;
  endTime: string;
  description: string;
}
