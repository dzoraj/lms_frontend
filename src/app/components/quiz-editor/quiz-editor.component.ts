import { Component, Input, OnChanges, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizDefinition } from '../../model/quiz/quiz-definition.model';
import { QuizOption } from '../../model/quiz/quiz-option.model';
import { QuizQuestion } from '../../model/quiz/quiz-question.model';
import { QuizService } from '../../service/quiz.service';

@Component({
  selector: 'app-quiz-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-editor.component.html',
  styleUrls: ['./quiz-editor.component.css']
})
export class QuizEditorComponent implements OnChanges {
  @Input({ required: true }) knowledgeEvaluationId!: number;

  loading = signal(false);
  error = signal<string | null>(null);
  info = signal<string | null>(null);
  defn = signal<QuizDefinition | null>(null);

  maxPoints = computed(() => this.defn()?.maxPoints ?? 0);
  sumPoints = computed(() => (this.defn()?.questions ?? []).reduce((a, q) => a + (q.points || 0), 0));

  constructor(private quiz: QuizService) {}

  ngOnChanges(): void {
    if (this.knowledgeEvaluationId) this.load();
  }

  load(): void {
  this.error.set(null);
  this.info.set(null);
  this.loading.set(true);

  this.quiz.getDefinition(this.knowledgeEvaluationId).subscribe({
    next: d => {
      d.questions = (d.questions ?? []).sort((a,b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
      d.questions.forEach(q => q.options = (q.options ?? []).sort((a,b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)));
      this.defn.set(d);
      this.loading.set(false);
    },
    error: err => {
      const msg = err?.error?.message || '';
      if (msg.includes('Quiz not found') || err?.status === 404) {
        this.quiz.getKe(this.knowledgeEvaluationId).subscribe({
          next: ke => {
            this.defn.set({
              id: undefined,
              knowledgeEvaluationId: this.knowledgeEvaluationId,
              title: '',
              instructions: '',
              maxPoints: ke.points ?? 0,
              active: true,
              questions: []
            });
            this.loading.set(false);
          },
          error: e2 => {
            this.error.set(e2?.error?.message || 'KnowledgeEvaluation not found');
            this.loading.set(false);
          }
        });
      } else {
        this.error.set(msg || 'Failed to load quiz');
        this.loading.set(false);
      }
    }
  });
}


  addQuestion(): void {
    const d = this.defn();
    if (!d) return;
    const orderIndex = (d.questions?.length || 0);
    const q: QuizQuestion = {
      text: '',
      type: 'SINGLE',
      points: 1,
      orderIndex,
      options: [
        { text: '', correct: true,  orderIndex: 0 },
        { text: '', correct: false, orderIndex: 1 }
      ]
    };
    this.defn.set({ ...d, questions: [...(d.questions ?? []), q] });
  }

  removeQuestion(idx: number): void {
    const d = this.defn();
    if (!d) return;
    const qs = (d.questions ?? []).slice();
    qs.splice(idx, 1);
    qs.forEach((q, i) => q.orderIndex = i);
    this.defn.set({ ...d, questions: qs });
  }

  addOption(qIdx: number): void {
    const d = this.defn();
    if (!d) return;
    const qs = (d.questions ?? []).slice();
    const q = { ...qs[qIdx] };
    const oi = (q.options?.length || 0);
    const opt: QuizOption = { text: '', correct: false, orderIndex: oi };
    q.options = [...(q.options ?? []), opt];
    qs[qIdx] = q;
    this.defn.set({ ...d, questions: qs });
  }

  removeOption(qIdx: number, oIdx: number): void {
    const d = this.defn();
    if (!d) return;
    const qs = (d.questions ?? []).slice();
    const q = { ...qs[qIdx] };
    const ops = (q.options ?? []).slice();
    ops.splice(oIdx, 1);
    ops.forEach((o, i) => o.orderIndex = i);
    q.options = ops;
    qs[qIdx] = q;
    this.defn.set({ ...d, questions: qs });
  }

  setSingleCorrect(qIdx: number, oIdx: number): void {
    const d = this.defn();
    if (!d) return;
    const qs = (d.questions ?? []).slice();
    const q = { ...qs[qIdx] };
    q.type = 'SINGLE';
    q.options = (q.options ?? []).map((o, i) => ({ ...o, correct: i === oIdx }));
    qs[qIdx] = q;
    this.defn.set({ ...d, questions: qs });
  }

  toggleMultiCorrect(qIdx: number, oIdx: number): void {
    const d = this.defn();
    if (!d) return;
    const qs = (d.questions ?? []).slice();
    const q = { ...qs[qIdx] };
    q.type = 'MULTI';
    const ops = (q.options ?? []).slice();
    const cur = ops[oIdx];
    ops[oIdx] = { ...cur, correct: !Boolean(cur.correct) };
    q.options = ops;
    qs[qIdx] = q;
    this.defn.set({ ...d, questions: qs });
  }

  moveQuestion(qIdx: number, dir: -1 | 1): void {
    const d = this.defn(); if (!d) return;
    const qs = (d.questions ?? []).slice();
    const ni = qIdx + dir;
    if (ni < 0 || ni >= qs.length) return;
    const [q] = qs.splice(qIdx, 1);
    qs.splice(ni, 0, q);
    qs.forEach((x, i) => x.orderIndex = i);
    this.defn.set({ ...d, questions: qs });
  }

  moveOption(qIdx: number, oIdx: number, dir: -1 | 1): void {
    const d = this.defn(); if (!d) return;
    const qs = (d.questions ?? []).slice();
    const q = { ...qs[qIdx] };
    const ops = (q.options ?? []).slice();
    const ni = oIdx + dir;
    if (ni < 0 || ni >= ops.length) return;
    const [o] = ops.splice(oIdx, 1);
    ops.splice(ni, 0, o);
    ops.forEach((x, i) => x.orderIndex = i);
    q.options = ops;
    qs[qIdx] = q;
    this.defn.set({ ...d, questions: qs });
  }

  save(): void {
    const d = this.defn();
    if (!d) return;
    this.error.set(null);
    this.info.set(null);

    const payload: QuizDefinition = {
      id: d.id,
      knowledgeEvaluationId: this.knowledgeEvaluationId,
      title: d.title || '',
      instructions: d.instructions || '',
      maxPoints: this.maxPoints(),
      active: d.active ?? true,
      questions: (d.questions ?? []).map((q, qi) => ({
        id: q.id,
        text: q.text || '',
        type: (q.type || 'SINGLE') as 'SINGLE' | 'MULTI',
        points: Number(q.points || 0),
        orderIndex: qi,
        options: (q.options ?? []).map((o, oi) => ({
          id: o.id,
          text: o.text || '',
          correct: Boolean(o.correct),
          orderIndex: oi
        }))
      }))
    };

    this.quiz.putDefinition(this.knowledgeEvaluationId, payload).subscribe({
      next: (res) => {
        this.defn.set(res);
        this.info.set('Quiz saved.');
        setTimeout(() => this.info.set(null), 2000);
      },
      error: (e) => {
        this.error.set(e?.error?.message || e?.message || 'Save failed');
      }
    });
  }
}
