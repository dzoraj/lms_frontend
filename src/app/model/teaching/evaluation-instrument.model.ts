import { KnowledgeEvaluation } from '../teaching/knowledge-evaluation.model';
import { File } from '../file.model';

export interface EvaluationInstrument {
  id?: number;
  name?: string | null;
  evaluations?: KnowledgeEvaluation[];
  file?: File | null;
}
