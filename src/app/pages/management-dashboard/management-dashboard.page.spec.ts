import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagementDashboardPage } from './management-dashboard.page';

describe('ManagementDashboardPage', () => {
  let component: ManagementDashboardPage;
  let fixture: ComponentFixture<ManagementDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
