import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaGeneralNotificationsComponent } from './sa-general-notifications.component';

describe('SaGeneralNotificationsComponent', () => {
  let component: SaGeneralNotificationsComponent;
  let fixture: ComponentFixture<SaGeneralNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaGeneralNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaGeneralNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
