import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DynamicService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private authHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  getAll<T>(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${endpoint}`, this.authHeaders());
  }

  getById<T>(endpoint: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`, this.authHeaders());
  }

  getByPath<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, this.authHeaders());
  }

  create<T>(endpoint: string, data: T): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, this.authHeaders());
  }

  update<T>(endpoint: string, id: number, data: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}`, data, this.authHeaders());
  }

  delete(endpoint: string, id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${endpoint}/${id}`, this.authHeaders());
  }

  getStudyProgramsByFaculty(facultyId: number) {
    return this.http.get<any[]>(
      `${this.baseUrl}/studyProgram/by-faculty/${facultyId}`,
      this.authHeaders()
    );
  }

  getStudyProgramOverview(programId: number) {
    return this.http.get<{
      id: number;
      name: string;
      leaderId: number | null;
      leaderName: string | null;
      subjects: any[]; 
    }>(`${this.baseUrl}/subject/program/${programId}/overview`, this.authHeaders());
  }

  getSubjectFull(subjectId: number) {
    return this.http.get<any>(`${this.baseUrl}/subject/${subjectId}/full`, this.authHeaders());
  }
}
