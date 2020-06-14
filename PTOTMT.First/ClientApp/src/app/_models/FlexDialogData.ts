import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

// FlexDialogData.ts
export interface FlexDialogData {
  id: string;
  userId: string;
  flexId: string;
  name: string;
  description: string;
  hours: number;
  onDate: NgbDateStruct;
  startTime: string;
  endTime: string;
  isNewEvent: boolean;
}
