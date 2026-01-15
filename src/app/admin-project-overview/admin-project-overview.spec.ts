import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProjectOverview } from './admin-project-overview';

describe('AdminProjectOverview', () => {
  let component: AdminProjectOverview;
  let fixture: ComponentFixture<AdminProjectOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProjectOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProjectOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
