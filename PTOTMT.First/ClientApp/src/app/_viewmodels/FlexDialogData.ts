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
  anotherDate: NgbDateStruct,
  coWorkerStartTime: string,
  coWorkerEndTime: string,
  isForward: boolean;
  hours: number;
  minutes: number;
  statusId: string;
  isNewEvent: boolean;
}
