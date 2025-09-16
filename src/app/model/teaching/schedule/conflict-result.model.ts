import { ConflictDetail } from "./conflict-detail.model";

export interface ConflictResult {
  hasConflicts: boolean;
  details: ConflictDetail[];
}