import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminServiceRequestsComponent } from './admin-service-requests';

describe('AdminServiceRequestsComponent', () => {
    let component: AdminServiceRequestsComponent;
    let fixture: ComponentFixture<AdminServiceRequestsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminServiceRequestsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(AdminServiceRequestsComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
