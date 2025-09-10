import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyProgramsDetailComponent } from './study-programs-detail.component';

describe('StudyProgramsDetailComponent', () => {
  let component: StudyProgramsDetailComponent;
  let fixture: ComponentFixture<StudyProgramsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyProgramsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyProgramsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
