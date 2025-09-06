import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { QuestionBase } from '../../model/questions/question-base';
import { QuestionService } from '../../service/question/question.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicFormComponent } from "../../dynamic-components/dynamic-form/dynamic-form.component";
import { GenericTableComponent } from '../../dynamic-components/generic-table/generic-table.component';

@Component({
  selector: 'app-generic-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicFormComponent, GenericTableComponent],
  templateUrl: './generic-crud.component.html',
  styleUrls: ['./generic-crud.component.css'],
})
export class GenericCrudComponent<T> implements OnInit {
    private router = inject(Router);  
  onBack() {
    this.router.navigate(['/admin-dashboard']);    
  }
  data: T[] = [];
  selectedModel: T | null = null;
  isEditing = false;

  questions: QuestionBase<string>[] = [];
  endpoint!: string;

  private route = inject(ActivatedRoute);
  private dynamicService = inject(DynamicService);
  public questionService = inject(QuestionService);

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.endpoint = params.get('endpoint') ?? '';
      this.loadData();
    });

    this.route.data.subscribe((data) => {
      this.questions = data['questions'] ?? [];
    });
  }

  loadData() {
    if (!this.endpoint) return;
    this.dynamicService.getAll<T>(this.endpoint).subscribe((data) => {
      this.data = data;
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
  console.log("Deleting ID in CRUD component:", id);
  if (confirm('Are you sure?')) {
    this.dynamicService.delete(this.endpoint, id).subscribe(() => {
      console.log("Successfully deleted, reloading data");
      this.loadData();
    });
  }
}


  onSubmit(model: T) {
    if (this.selectedModel) {
      this.dynamicService.update(this.endpoint, (model as any).id, model).subscribe(() => {
        this.isEditing = false;
        this.loadData();
      });
    } else {
      this.dynamicService.create(this.endpoint, model).subscribe(() => {
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
