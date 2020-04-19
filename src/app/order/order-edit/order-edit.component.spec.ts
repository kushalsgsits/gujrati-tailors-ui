import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderEditComponent } from './order-edit.component';
import { OrderService } from '../order.service';

describe('OrderEditComponent', () => {
	let component: OrderEditComponent;
	let fixture: ComponentFixture<OrderEditComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OrderEditComponent],
			imports: [FormsModule, HttpClientTestingModule, RouterTestingModule],
			providers: [OrderService]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrderEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
