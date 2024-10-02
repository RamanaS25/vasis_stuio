import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseDashboardPage } from './course-dashboard.page';

describe('CourseDashboardPage', () => {
  let component: CourseDashboardPage;
  let fixture: ComponentFixture<CourseDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
