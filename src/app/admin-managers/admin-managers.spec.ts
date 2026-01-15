import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManagers } from './admin-managers';

describe('AdminManagers', () => {
  let component: AdminManagers;
  let fixture: ComponentFixture<AdminManagers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminManagers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminManagers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
