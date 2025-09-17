import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportEvaluationAttemptComponent } from './import-evaluation-attempt.component';

describe('ImportEvaluationAttemptComponent', () => {
  let component: ImportEvaluationAttemptComponent;
  let fixture: ComponentFixture<ImportEvaluationAttemptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportEvaluationAttemptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportEvaluationAttemptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
