import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizDefinition } from '../../model/quiz/quiz-definition.model';
import { QuizSubmission } from '../../model/quiz/quiz-submission.model';
import { EvaluationAttempt } from '../../model/teaching/evaluation-attempt.model';
import { QuizService } from '../../service/quiz.service';

type State = 'idle' | 'loading' | 'ready' | 'submitting' | 'done' | 'error';

@Component({
  selector: 'app-quiz-take',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-take.component.html',
  styleUrls: ['./quiz-take.component.css']
})
export class QuizTakeComponent implements OnChanges {
  @Input({ required: true }) knowledgeEvaluationId!: number;
  @Input({ required: true }) studentInYearId!: number;

  @Output() finished = new EventEmitter<EvaluationAttempt>();

  state = signal<State>('idle');
  error = signal<string | null>(null);

  defn = signal<QuizDefinition | null>(null);
  answers = new Map<number, Set<number>>(); 

  totalMax = 0;

  constructor(private quiz: QuizService) {}

  ngOnChanges(): void {
    if (this.knowledgeEvaluationId && this.studentInYearId) this.load();
  }

  private load(): void {
    this.state.set('loading');
    this.error.set(null);
    this.quiz.getDefinition(this.knowledgeEvaluationId).subscribe({
      next: (d) => {

        d = this.quiz.stripCorrect(d);
        d.questions = (d.questions ?? []).slice().sort((a,b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        d.questions.forEach(q => q.options = (q.options ?? []).slice().sort((a,b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)));
        this.defn.set(d);
        this.totalMax = this.quiz.sumMax(d);
        this.answers = new Map<number, Set<number>>();
        this.state.set('ready');
      },
      error: (e) => {
        this.error.set(e?.error?.message || e?.message || 'Failed to load quiz');
        this.state.set('error');
      }
    });
  }

  toggleSelect(qId: number, optId: number, type: 'SINGLE' | 'MULTI'): void {
    const cur = this.answers.get(qId) ?? new Set<number>();
    if (type === 'SINGLE') {
      this.answers.set(qId, new Set([optId]));
    } else {
      if (cur.has(optId)) cur.delete(optId); else cur.add(optId);
      this.answers.set(qId, cur);
    }
  }

  isSelected(qId: number, optId: number): boolean {
    return this.answers.get(qId)?.has(optId) ?? false;
    }

  submit(): void {
    const d = this.defn();
    if (!d) return;

    const payload: QuizSubmission = {
      knowledgeEvaluationId: this.knowledgeEvaluationId,
      studentInYearId: this.studentInYearId,
      answers: (d.questions ?? []).map(q => ({
        questionId: q.id!,
        selectedOptionIds: Array.from(this.answers.get(q.id!) ?? [])
      }))
    };

    this.state.set('submitting');
    this.quiz.submit(payload).subscribe({
      next: (attempt) => {
        this.state.set('done');
        this.finished.emit(attempt);
      },
      error: (e) => {
        this.error.set(e?.error?.message || e?.message || 'Submit failed');
        this.state.set('error');
      }
    });
  }
}
