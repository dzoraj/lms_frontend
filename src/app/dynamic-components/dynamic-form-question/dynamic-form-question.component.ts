import {Component, Input} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { QuestionBase } from '../../model/questions/question-base';
@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class DynamicFormQuestionComponent {
  @Input() question!: QuestionBase<string>;
  @Input() form!: FormGroup;
  get isValid() {
    return this.form.controls[this.question.key].valid;
  }

  get isTouched() {
    return this.form.controls[this.question.key].touched;
  }

  get hasErrors() {
    return this.form.controls[this.question.key].errors != null;
  }

  get errorMessage() {
    const errors = this.form.controls[this.question.key].errors;

    let outPut = '';
    if (errors) {
      if (errors['required']) {
        outPut += `${this.question.label} is required.\n`;
      }
    }
    return outPut;
  }

  comparator(v1: any, v2: any) {
    return v1==v2;
  }

}