import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { QuestionBase } from '../../model/questions/question-base';
import { QuestionService } from '../question/question.service';

@Injectable({ providedIn: 'root' })
export class QuestionResolver implements Resolve<QuestionBase<string>[]> {
  constructor(private questionService: QuestionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<QuestionBase<string>[]> {
    const endpoint = route.params['endpoint'];
    const methodName = `get${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}Questions`;

    if (typeof (this.questionService as any)[methodName] === 'function') {
      return (this.questionService as any)[methodName]();
    } else {
      console.error(`Method ${methodName} not found in QuestionService`);
      return of([]); // fallback
    }
  }
}
