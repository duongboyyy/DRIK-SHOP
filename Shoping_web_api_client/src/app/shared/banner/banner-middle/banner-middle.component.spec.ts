import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerMiddleComponent } from './banner-middle.component';

describe('BannerMiddleComponent', () => {
  let component: BannerMiddleComponent;
  let fixture: ComponentFixture<BannerMiddleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerMiddleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerMiddleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
