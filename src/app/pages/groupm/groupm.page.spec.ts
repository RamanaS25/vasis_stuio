import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupmPage } from './groupm.page';

describe('GroupmPage', () => {
  let component: GroupmPage;
  let fixture: ComponentFixture<GroupmPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
