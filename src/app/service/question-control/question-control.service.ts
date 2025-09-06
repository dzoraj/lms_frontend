import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from '../../model/questions/question-base';

@Injectable()
export class QuestionControlService {
  toFormGroup(questions: QuestionBase<string>[], model: any = {}): FormGroup {
    const group: any = {};
    questions.forEach((question) => { 
      const validators = question.required ? [Validators.required] : [];
      group[question.key] = new FormControl(model[question.key] || '', validators);
    });

    const formGroup = new FormGroup(group);
    return formGroup;
  }
}
