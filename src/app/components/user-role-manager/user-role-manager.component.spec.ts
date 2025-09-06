import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleManagerComponent } from './user-role-manager.component';

describe('UserRoleManagerComponent', () => {
  let component: UserRoleManagerComponent;
  let fixture: ComponentFixture<UserRoleManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoleManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRoleManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
