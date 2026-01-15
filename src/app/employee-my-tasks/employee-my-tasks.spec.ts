import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMyTasks } from './employee-my-tasks';

describe('EmployeeMyTasks', () => {
  let component: EmployeeMyTasks;
  let fixture: ComponentFixture<EmployeeMyTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeMyTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeMyTasks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
