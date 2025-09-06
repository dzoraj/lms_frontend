import { TestBed } from '@angular/core/testing';

import { SelectedFacultyService } from './selected-faculty.service';

describe('SelectedFacultyService', () => {
  let service: SelectedFacultyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedFacultyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
