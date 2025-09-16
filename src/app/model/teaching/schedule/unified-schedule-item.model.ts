import { ScheduleItemType } from "./schedule-item-type.model";

export interface UnifiedScheduleItem {
  type: ScheduleItemType;
  id: number;
  startTime: string;           
  endTime: string;             
  courseRealizationId: number;
  subjectName?: string;
  label?: string;              
}