import { GradeBoundary } from "./grade-boundary.model";

export interface GradingScheme {
  id: number;
  totalPoints: number;
  threshold: number;
  gradeBoundaries?: GradeBoundary[];
}
