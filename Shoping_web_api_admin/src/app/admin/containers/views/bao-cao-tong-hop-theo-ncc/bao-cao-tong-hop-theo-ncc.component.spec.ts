/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BaoCaoTongHopTheoNccComponent } from './bao-cao-tong-hop-theo-ncc.component';

describe('BaoCaoTongHopTheoNccComponent', () => {
  let component: BaoCaoTongHopTheoNccComponent;
  let fixture: ComponentFixture<BaoCaoTongHopTheoNccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaoCaoTongHopTheoNccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCaoTongHopTheoNccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
