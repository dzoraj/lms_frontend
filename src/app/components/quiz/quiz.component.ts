import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizEditorComponent } from '../quiz-editor/quiz-editor.component';
import { QuizTakeComponent } from '../quiz-take/quiz-take.component';
import { EvaluationAttempt } from '../../model/teaching/evaluation-attempt.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, QuizEditorComponent, QuizTakeComponent],
  templateUrl:'\quiz.component.html'
})
export class QuizComponent {
  @Input() mode: 'editor' | 'take' = 'editor';
  @Input() knowledgeEvaluationId!: number | null;
  @Input() studentInYearId!: number | null;

  finished(_: EvaluationAttempt) {}
}
