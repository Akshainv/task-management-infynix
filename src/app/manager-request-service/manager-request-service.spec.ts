import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerRequestService } from './manager-request-service';

describe('ManagerRequestService', () => {
  let component: ManagerRequestService;
  let fixture: ComponentFixture<ManagerRequestService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerRequestService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerRequestService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
