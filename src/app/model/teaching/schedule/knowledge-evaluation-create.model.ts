export interface KnowledgeEvaluationCreate {
  startTime: string;                
  endTime: string;                  
  points?: number | null;
  evaluationInstrumentId: number;
  evaluationTypeId: number;
  courseRealizationId: number;
  learningOutcomeIds?: number[];
}
