import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeworkmPage } from './homeworkm.page';

describe('HomeworkmPage', () => {
  let component: HomeworkmPage;
  let fixture: ComponentFixture<HomeworkmPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeworkmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
