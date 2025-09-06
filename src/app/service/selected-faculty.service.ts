import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedFacultyService {
  private selectedFacultySubject = new BehaviorSubject<number | null>(null);
  selectedFaculty$ = this.selectedFacultySubject.asObservable();

  setFaculty(facultyId: number | null) {
    this.selectedFacultySubject.next(facultyId);
  }
}
