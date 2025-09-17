import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultySuppliesComponent } from './faculty-supplies.component';

describe('FacultySuppliesComponent', () => {
  let component: FacultySuppliesComponent;
  let fixture: ComponentFixture<FacultySuppliesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultySuppliesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacultySuppliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
