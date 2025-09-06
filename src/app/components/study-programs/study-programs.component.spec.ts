import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyProgramsComponent } from './study-programs.component';

describe('StudyProgramsComponent', () => {
  let component: StudyProgramsComponent;
  let fixture: ComponentFixture<StudyProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyProgramsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
