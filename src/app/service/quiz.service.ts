import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { QuizDefinition } from '../model/quiz/quiz-definition.model';
import { QuizSubmission } from '../model/quiz/quiz-submission.model';
import { EvaluationAttempt } from '../model/teaching/evaluation-attempt.model';
import { KnowledgeEvaluation } from '../model/teaching/knowledge-evaluation.model';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private base = 'http://localhost:8080/api/quiz';
  private baseKe   = 'http://localhost:8080/api/knowledgeEvaluation';


  constructor(private http: HttpClient) {}

  private auth() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
    return { headers };
  }

  getDefinition(knowledgeEvaluationId: number): Observable<QuizDefinition> {
    return this.http.get<QuizDefinition>(`${this.base}/definition/${knowledgeEvaluationId}`, this.auth());
  }

  putDefinition(knowledgeEvaluationId: number, dto: QuizDefinition): Observable<QuizDefinition> {
    return this.http.put<QuizDefinition>(`${this.base}/definition/${knowledgeEvaluationId}`, dto, this.auth());
  }

  submit(sub: QuizSubmission): Observable<EvaluationAttempt> {
    return this.http.post<EvaluationAttempt>(`${this.base}/submit`, sub, this.auth());
  }

  stripCorrect(def: QuizDefinition): QuizDefinition {
    return {
      ...def,
      questions: def.questions.map(q => ({
        ...q,
        options: (q.options ?? []).map(o => ({ ...o, correct: null }))
      }))
    };
  }

  sumMax(def: QuizDefinition): number {
    return (def.questions ?? []).reduce((acc, q) => acc + (q.points || 0), 0);
  }
  getKe(id: number): Observable<KnowledgeEvaluation> {
    return this.http.get<KnowledgeEvaluation>(`${this.baseKe}/${id}`, this.auth());
  }
}
