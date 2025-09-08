// src/app/services/dynamic.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DynamicService {
  private baseUrl = "http://localhost:8080/api";

  constructor(private http: HttpClient) { }

  getAll<T>(endpoint:string): Observable<T[]>{
    return this.http.get<T[]>(`${this.baseUrl}/${endpoint}`);
  }

  getById<T>(endpoint: string, id: number): Observable<T> {
    const token = localStorage.getItem('token');
    return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }


  create<T>(endpoint:string, data:T): Observable<T>{
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  update<T>(endpoint:string,id:number, data:T): Observable<T>{
    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}`, data);
  }

  delete(endpoint: string, id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${endpoint}/${id}`);
  }

  getStudyProgramsByFaculty(facultyId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/studyProgram/by-faculty/${facultyId}`);
  }


  getByPath<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`);
  }
}
