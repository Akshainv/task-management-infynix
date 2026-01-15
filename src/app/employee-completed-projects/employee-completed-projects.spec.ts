import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCompletedProjects } from './employee-completed-projects';

describe('EmployeeCompletedProjects', () => {
  let component: EmployeeCompletedProjects;
  let fixture: ComponentFixture<EmployeeCompletedProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCompletedProjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCompletedProjects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
