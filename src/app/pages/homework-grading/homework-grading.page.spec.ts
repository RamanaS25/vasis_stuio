import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeworkGradingPage } from './homework-grading.page';

describe('HomeworkGradingPage', () => {
  let component: HomeworkGradingPage;
  let fixture: ComponentFixture<HomeworkGradingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeworkGradingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
