import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderListComponent } from './order-list.component';
import { OrderService } from '../order.service';

describe('OrderListComponent', () => {
	let component: OrderListComponent;
	let fixture: ComponentFixture<OrderListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OrderListComponent],
			imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
			providers: [OrderService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrderListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
