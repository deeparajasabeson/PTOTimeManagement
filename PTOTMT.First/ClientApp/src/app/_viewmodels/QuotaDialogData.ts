import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TeamFromDBEntity } from '../_entities/TeamFromDBEntity';

// QuotaDialogData.ts
export interface QuotaDialogData {
  id: string;
  quotaName: string;
  teamId: string;
  teams: TeamFromDBEntity[];
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
