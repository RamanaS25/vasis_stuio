import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentSessionsPage } from './student-sessions.page';

describe('StudentSessionsPage', () => {
  let component: StudentSessionsPage;
  let fixture: ComponentFixture<StudentSessionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSessionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
