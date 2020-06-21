import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { FlexTypeFromDBEntity } from "../_entities/FlexTypeFromDBEntity";

// FlexDialogData.ts
export interface FlexDialogData {
  id: string;
  userId: string;
  flexTypeId: string;
  flexTypeValue: string;
  flexTypes: FlexTypeFromDBEntity[];
  name: string;
  description: string;
  onDate: NgbDateStruct;
  startTime: string;
  endTime: string;
  coWorkerId: string;
  coWorkerDate: NgbDateStruct,
  coWorkerStartTime: string,
  coWorkerEndTime: string,
  isForward: boolean;
  hours: number;
  minutes: number;
  isNewEvent: boolean;
}
