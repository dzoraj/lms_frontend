import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DynamicFormQuestionComponent} from '../dynamic-form-question/dynamic-form-question.component';
import {QuestionControlService} from '../../service/question-control/question-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionBase } from '../../model/questions/question-base';
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [QuestionControlService],
  imports: [CommonModule, DynamicFormQuestionComponent, ReactiveFormsModule],
})
export class DynamicFormComponent implements OnInit {
  @Input() questions: QuestionBase<string>[] | null = [];

  form!: FormGroup;
  @Input()
  model:any = {};

  @Output()
  submitEvent = new EventEmitter<any>();

  constructor(private qcs: QuestionControlService, private router: Router, private route: ActivatedRoute) {}
  ngOnInit() {
    this.buildForm();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['model'] && !changes['model'].firstChange) {
      this.buildForm();
    }
  }

  buildForm(){
    this.form = this.qcs.toFormGroup(this.questions as QuestionBase<string>[], this.model);
  }

  onSubmit() {
    if(this.form.valid){
      this.submitEvent.emit(this.form.getRawValue());
    }
  }

  resetForm(){
    window.location.reload();
    this.form.reset;
    const basePath = this.route.snapshot.url[0]?.path;
    if (basePath) {
      this.router.navigate(['/', basePath]);
    }
  }
}