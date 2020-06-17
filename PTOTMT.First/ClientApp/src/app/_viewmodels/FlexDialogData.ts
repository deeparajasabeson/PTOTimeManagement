import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { FlexTypeFromDBEntity } from "../_entities/FlexTypeFromDBEntity";

// FlexDialogData.ts
export interface FlexDialogData {
  id: string;
  userId: string;
  flexTypeId: string;
  flexTypes: FlexTypeFromDBEntity[];
  name: string;
  description: string;
  onDate: NgbDateStruct;
  startTime: string;
  endTime: string;
  hours: number;
  minutes: number;
  isNewEvent: boolean;
}
