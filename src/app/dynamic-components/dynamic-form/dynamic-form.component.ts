import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuestionControlService } from '../../service/question-control/question-control.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionBase } from '../../model/questions/question-base';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [QuestionControlService],
  imports: [CommonModule, ReactiveFormsModule],
})
export class DynamicFormComponent implements OnInit {
  @Input() questions: QuestionBase<any>[] | null = [];
  @Input() model: any = {};

  @Output() submitEvent = new EventEmitter<any>();

  form!: FormGroup;
opt: any;

  constructor(
    private qcs: QuestionControlService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

ngOnInit() {
  if (this.questions instanceof Observable) {
    this.questions.subscribe(qs => this.questions = qs);
  }
  this.buildForm();
}


  ngOnChanges(changes: SimpleChanges) {
    if (changes['model'] && !changes['model'].firstChange) {
      this.buildForm();
    }
  }

  buildForm() {
    this.form = this.qcs.toFormGroup(this.questions || [], this.model);
      console.log(this.form.controls); // check all keys
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitEvent.emit(this.form.getRawValue());
    }
  }

  resetForm() {
    this.form.reset();
    const basePath = this.route.snapshot.url[0]?.path;
    if (basePath) {
      this.router.navigate(['/', basePath]);
    }
  }
}
