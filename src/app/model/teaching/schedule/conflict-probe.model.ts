import { ScheduleItemType } from "./schedule-item-type.model";

export interface ConflictProbe {
  type: ScheduleItemType;
  courseRealizationId?: number;
  teacherId?: number;
  start: string; 
  end: string;
}