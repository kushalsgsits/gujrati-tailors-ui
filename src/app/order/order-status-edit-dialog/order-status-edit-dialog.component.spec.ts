import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusEditDialogComponent } from './order-status-edit-dialog.component';

describe('OrderStatusEditDialogComponent', () => {
  let component: OrderStatusEditDialogComponent;
  let fixture: ComponentFixture<OrderStatusEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderStatusEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderStatusEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
