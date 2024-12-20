import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotationsPage } from './notations.page';

describe('NotationsPage', () => {
  let component: NotationsPage;
  let fixture: ComponentFixture<NotationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
