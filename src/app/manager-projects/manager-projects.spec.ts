import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerProjects } from './manager-projects';

describe('ManagerProjects', () => {
  let component: ManagerProjects;
  let fixture: ComponentFixture<ManagerProjects>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerProjects]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerProjects);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
