import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotationPage } from './notation.page';

describe('NotationPage', () => {
  let component: NotationPage;
  let fixture: ComponentFixture<NotationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
