import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaComponent } from './sa.component';

describe('SaComponent', () => {
  let component: SaComponent;
  let fixture: ComponentFixture<SaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
