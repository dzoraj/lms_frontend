import { ScheduleItemType } from "./schedule-item-type.model";

export interface ConflictDetail {
  kind: 'sameCourseOverlap' | 'teacherOverlap' | 'crossOverlap';
  againstType: ScheduleItemType;
  againstId: number;
  info: string;
}