import { Component } from '@angular/core';
import { ENTITY_CONFIG } from '../../configurations/entity.config';
import { NgFor, NgIf } from '@angular/common';
import { UserRoleManagerComponent } from '../user-role-manager/user-role-manager.component';
import { NavbarComponent } from "../navbar/navbar.component";
import { DynamicService } from '../../service/dynamic-service/dynamic.service';
import { GenericTableComponent } from '../../dynamic-components/generic-table/generic-table.component';
import { DynamicFormComponent } from '../../dynamic-components/dynamic-form/dynamic-form.component';
import { QuestionService } from '../../service/question/question.service';
import { QuestionBase } from '../../model/questions/question-base';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [
    NgFor,
    NgIf,
    UserRoleManagerComponent,
    NavbarComponent,
    GenericTableComponent,
    DynamicFormComponent,
    FileUploadComponent
  ],
})
export class AdminDashboardComponent {
  ENTITY_CONFIG = ENTITY_CONFIG;
  entityKeys = Object.keys(ENTITY_CONFIG) as (keyof typeof ENTITY_CONFIG)[];
  showUserRoleManager = false;

  openEntities: {
    key: string;
    title: string;
    endpoint: string;
    data: any[];
    mode: 'table' | 'form';
    formQuestions: QuestionBase<any>[] | null;
    formModel: any;
  }[] = [];


  constructor(
    private dynamicService: DynamicService,
    private questionService: QuestionService
  ) { }

  getTitle(key: keyof typeof ENTITY_CONFIG): string {
    return this.ENTITY_CONFIG[key].title;
  }

  getEndpoint(key: keyof typeof ENTITY_CONFIG): string {
    return this.ENTITY_CONFIG[key].endpoint;
  }

  toggleRoleManager() {
    this.showUserRoleManager = !this.showUserRoleManager;
  }

  openEntity(key: keyof typeof ENTITY_CONFIG) {
    const title = this.getTitle(key);
    const endpoint = this.getEndpoint(key);

    if (this.openEntities.some(e => e.key === key)) return;

    this.dynamicService.getAll<any>(endpoint).subscribe(data => {
      this.openEntities.push({
        key,
        title,
        endpoint,
        data,
        mode: 'table',
        formQuestions: null,
        formModel: null
      });
    });
  }


  closeEntity(key: string) {
    this.openEntities = this.openEntities.filter(e => e.key !== key);
  }

  handleEdit(key: string, row: any) {
    const entity = this.openEntities.find(e => e.key === key);
    if (!entity) return;

    const fnName = `get${entity.title.replace(/\s/g, '')}Questions` as keyof QuestionService;
    if (typeof this.questionService[fnName] === 'function') {
      const q$ = (this.questionService[fnName] as any)();
      if (q$.subscribe) {
        q$.subscribe((qs: QuestionBase<any>[]) => {
          entity.formQuestions = qs;
          entity.formModel = row;
          entity.mode = 'form';
        });
      } else {
        entity.formQuestions = q$;
        entity.formModel = row;
        entity.mode = 'form';
      }
    } else {
      console.warn(`No questions function for ${entity.title}`);
    }
  }
handleFormSubmit(key: string, submitted: any) {
  const entity = this.openEntities.find(e => e.key === key);
  if (!entity) return;

  const request$ = submitted.id
    ? this.dynamicService.update(entity.endpoint, submitted.id, submitted)
    : this.dynamicService.create(entity.endpoint, submitted);

  request$.subscribe(() => {
    this.dynamicService.getAll<any>(entity.endpoint).subscribe(data => {
      entity.data = data;
      entity.mode = 'table'; 
    });
  });
}

  handleAdd(key: string) {
  const entity = this.openEntities.find(e => e.key === key);
  if (!entity) return;

  const fnName = `get${entity.title.replace(/\s/g, '')}Questions` as keyof QuestionService;
  if (typeof this.questionService[fnName] === 'function') {
    const q$ = (this.questionService[fnName] as any)();
    if (q$.subscribe) {
      q$.subscribe((qs: QuestionBase<any>[]) => {
        entity.formQuestions = qs;
        entity.formModel = {}; 
        entity.mode = 'form';
      });
    } else {
      entity.formQuestions = q$;
      entity.formModel = {};
      entity.mode = 'form';
    }
  }
}

handleDelete(key: string, id: number) {
  const entity = this.openEntities.find(e => e.key === key);
  if (!entity) return;

  this.dynamicService.delete(entity.endpoint, id).subscribe(() => {
    this.dynamicService.getAll<any>(entity.endpoint).subscribe(data => {
      entity.data = data; 
    });
  });
}

}
