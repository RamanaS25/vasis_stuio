import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeworkSubmissionPage } from './homework-submission.page';

describe('HomeworkSubmissionPage', () => {
  let component: HomeworkSubmissionPage;
  let fixture: ComponentFixture<HomeworkSubmissionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeworkSubmissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
