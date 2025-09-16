import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnifiedScheduleItem } from '../model/teaching/schedule/unified-schedule-item.model';
import { ConflictProbe } from '../model/teaching/schedule/conflict-probe.model';
import { ConflictResult } from '../model/teaching/schedule/conflict-result.model';
import { RecurringTeachingSessionRequest } from '../model/teaching/schedule/recurring-teaching-session-request.model';

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private base = 'http://localhost:8080/api/schedule';

  constructor(private http: HttpClient) {}

  private auth() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
    return { headers };
  }

  unified(studyYearId: number, fromLocalIso: string, toLocalIso: string): Observable<UnifiedScheduleItem[]> {
    const params = new HttpParams().set('from', fromLocalIso).set('to', toLocalIso);
    return this.http.get<UnifiedScheduleItem[]>(`${this.base}/studyYear/${studyYearId}`, { ...this.auth(), params });
  }

  createRecurringTeaching(req: RecurringTeachingSessionRequest): Observable<number[]> {
    return this.http.post<number[]>(`${this.base}/teaching/recurring`, req, this.auth());
  }

  checkConflicts(probes: ConflictProbe[]): Observable<ConflictResult> {
    return this.http.post<ConflictResult>(`${this.base}/conflicts`, probes, this.auth());
  }
}
