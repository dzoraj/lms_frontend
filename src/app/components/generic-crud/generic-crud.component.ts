import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { QuestionService } from '../../service/question/question.service';
import { QuestionBase } from '../../model/questions/question-base';

import { DynamicFormComponent } from '../../dynamic-components/dynamic-form/dynamic-form.component';
import { GenericTableComponent } from '../../dynamic-components/generic-table/generic-table.component';

@Component({
  selector: 'app-generic-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicFormComponent, GenericTableComponent],
  templateUrl: './generic-crud.component.html',
  styleUrls: ['./generic-crud.component.css'],
})
export class GenericCrudComponent<T> implements OnInit, OnChanges {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dynamicService = inject(DynamicService);
  public questionService = inject(QuestionService);

  @Input() endpointInput?: string;                
  @Input() listEndpointInput?: string;             
  @Input() questionsInput?: QuestionBase<any>[];  

  @Input() tableDisplayedColumns: string[] = [];
  @Input() tableHiddenKeys: string[] = ['id', 'deleted', 'evaluations'];
  @Input() tableColumnLabels: Record<string, string> = {};
  @Input() tableColumnRenderers: Record<string, (row: any) => string> = {};

  data: T[] = [];
  selectedModel: T | null = null;
  isEditing = false;

  questions: QuestionBase<string>[] = [];

  endpoint: string = '';     
  listEndpoint: string = ''; 

  get headerTitle(): string {
    return this.listEndpoint || this.endpoint || '';
  }


  ngOnInit() {
    if (this.endpointInput) {
      this.endpoint = this.endpointInput ?? '';
      this.listEndpoint = this.listEndpointInput ?? this.endpoint;
      if (this.questionsInput && this.questionsInput.length) {
        this.questions = this.questionsInput as any;
      }
      this.loadData();
      return;
    }

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.endpoint = params.get('endpoint') ?? '';
      this.listEndpoint = this.endpoint;
      this.loadData();
    });
    this.route.data.subscribe((data) => {
      this.questions = data['questions'] ?? [];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionsInput']) {
      const qs = changes['questionsInput'].currentValue as QuestionBase<any>[] | undefined;
      if (qs && qs.length) {
        this.questions = qs as any;
      }
    }

    let shouldReload = false;

    if (changes['endpointInput']) {
      const ep = changes['endpointInput'].currentValue as string | undefined;
      if (typeof ep === 'string') {
        this.endpoint = ep;
        shouldReload = true;
      }
    }

    if (changes['listEndpointInput']) {
      const lep = changes['listEndpointInput'].currentValue as string | undefined;
      if (typeof lep === 'string') {
        this.listEndpoint = lep || this.endpoint;
        shouldReload = true;
      }
    }

    if (shouldReload && this.endpoint) {
      this.loadData();
    }
  }


  onBack() {
    this.router.navigate(['/admin-dashboard']);
  }

  loadData() {
    if (!this.listEndpoint) return;
    this.dynamicService.getAll<T>(this.listEndpoint).subscribe((data) => {
      this.data = data ?? [];
    });
  }

  onAdd() {
    this.selectedModel = null;
    this.isEditing = true;
  }

  onEdit(model: T) {
    this.selectedModel = model;
    this.isEditing = true;
  }

  onDelete(id: number) {
    if (confirm('Are you sure?')) {
      this.dynamicService.delete(this.endpoint, id).subscribe(() => this.loadData());
    }
  }

onSubmit(model: any) {
  const payload: any = { ...model };

  if ((this.endpoint || '').toLowerCase() === 'evaluationinstrument') {
    if (payload.file === '' || payload.file === undefined) {
      payload.file = null; 
    } else if (typeof payload.file === 'number') {
      payload.file = { id: payload.file };
    } else if (payload.file && typeof payload.file === 'string') {
      const n = Number(payload.file);
      payload.file = Number.isFinite(n) ? { id: n } : null;
    }
  }

  if (this.selectedModel) {
    this.dynamicService.update(this.endpoint, payload.id, payload).subscribe(() => {
      this.isEditing = false;
      this.loadData();
    });
  } else {
    this.dynamicService.create(this.endpoint, payload).subscribe(() => {
      this.isEditing = false;
      this.loadData();
    });
  }
}


  onCancel() {
    this.isEditing = false;
    this.selectedModel = null;
  }
}
