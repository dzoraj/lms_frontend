import { GradingScheme } from "./grading-scheme.model";

export interface GradeBoundary {
  id: number;
  minPoints: number;
  gradeValue: number;
  gradingScheme?: GradingScheme; 
}
