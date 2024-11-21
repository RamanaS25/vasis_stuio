import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MuxVideoPlayerComponent } from './mux-video-player.component';

describe('MuxVideoPlayerComponent', () => {
  let component: MuxVideoPlayerComponent;
  let fixture: ComponentFixture<MuxVideoPlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MuxVideoPlayerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MuxVideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
