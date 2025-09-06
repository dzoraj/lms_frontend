import { EducationalGoal } from '../teaching/educational-goal.model';
import { KnowledgeEvaluation } from '../teaching/knowledge-evaluation.model';
import { TeachingMaterial } from '../teaching/teaching-material.model';
import { TeachingSession } from '../teaching/teaching-session.model';
import { Subject } from './subject.model';


export interface LearningOutcome {
  id: number;
  description?: string;
  subject?: Subject;
  educationalGoals?: EducationalGoal[];
  teachingMaterials?: TeachingMaterial[];
  knowledgeEvaluations?: KnowledgeEvaluation[];
  teachingSessions?: TeachingSession[];
}
