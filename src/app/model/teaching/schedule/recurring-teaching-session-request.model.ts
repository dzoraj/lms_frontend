export interface RecurringTeachingSessionRequest {
  courseRealizationId: number;
  teachingTypeId: number;
  startDate: string; 
  endDate: string;   
  startTime: string; 
  endTime: string; 
  daysOfWeek: string[];
  learningOutcomeIds?: number[];
  skipDates?: string[];
}