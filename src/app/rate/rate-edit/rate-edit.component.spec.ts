import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateEditComponent } from './rate-edit.component';

describe('RateEditComponent', () => {
  let component: RateEditComponent;
  let fixture: ComponentFixture<RateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
