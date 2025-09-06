import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { QuestionBase } from '../../model/questions/question-base';
import { QuestionService } from '../question/question.service';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuestionResolver implements Resolve<QuestionBase<any>[]> {
  constructor(private questionService: QuestionService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<QuestionBase<any>[]> {
    const endpoint = route.params['endpoint'];
    const methodName = `get${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}Questions`;

    if (typeof (this.questionService as any)[methodName] !== 'function') {
      console.error(`Method ${methodName} not found in QuestionService`);
      return of([]);
    }

    const state = history.state;

    return of((this.questionService as any)[methodName](state));
  }
}
