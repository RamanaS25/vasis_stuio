import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentmPage } from './studentm.page';

describe('StudentmPage', () => {
  let component: StudentmPage;
  let fixture: ComponentFixture<StudentmPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
