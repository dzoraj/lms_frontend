import { KnowledgeEvaluation } from './knowledge-evaluation.model';

export interface EvaluationType {
  id?: number;
  name?: string | null;
  evaluations?: KnowledgeEvaluation[];
}
