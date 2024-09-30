import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SyllabusPage } from './syllabus.page';

describe('SyllabusPage', () => {
  let component: SyllabusPage;
  let fixture: ComponentFixture<SyllabusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SyllabusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
