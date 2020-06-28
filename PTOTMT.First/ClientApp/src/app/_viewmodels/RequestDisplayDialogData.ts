import { FlexFromDBEntity } from "../_entities/FlexFromDBEntity";
import { PTOFromDBEntity } from "../_entities/PTOFromDBEntity";

// RequestDisplayDialogData.ts
export interface RequestDisplayDialogData {
  isPTO: boolean;
  isShiftSwap: boolean;
  isSelfShiftSwap: boolean;
  isShiftSlide: boolean;
  isPreArrangedShiftSlide: boolean;
  ptoRequest: PTOFromDBEntity;
  flexRequest: FlexFromDBEntity;
}
