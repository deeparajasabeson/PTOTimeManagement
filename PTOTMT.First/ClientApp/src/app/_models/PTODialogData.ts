import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { RequestTypeFromDBEntity } from '../_entities/RequestTypeFromDBEntity';

// PTODialogData.ts
export interface PTODialogData {
  id: string;
  userId: string;
  requestTypeId: string;
  requestTypes: RequestTypeFromDBEntity[];
  description: string;
  hours: number;
  allDay: boolean;
  startDate: NgbDateStruct;
  startTime: string;
  endDate: NgbDateStruct;
  endTime: string;
}
