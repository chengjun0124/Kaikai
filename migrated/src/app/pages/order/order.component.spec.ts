import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { OrderComponent } from './order.component';
import { ReactiveFormsModule, FormControlName } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService, OrderServiceMock } from 'src/app/services/order.service';
import { MatDialogModule } from '@angular/material/dialog';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import {By} from '@angular/platform-browser';

describe('OrderComponent', () => {
	let component: OrderComponent;
	let fixture: ComponentFixture<OrderComponent>;
	let de:DebugElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OrderComponent],
			imports: [
				ReactiveFormsModule,
				MatDialogModule,
				HttpClientModule
			],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: {
						snapshot: {
							params: {
								orderId: null
							}
						}
					},
				},
				{ provide: OrderService, useClass: OrderServiceMock },
				StorageService
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		de = fixture.debugElement;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should say hi', async(() => {
		fixture.whenStable().then(()=>{
			expect(de.query(By.css('#td_m_neck')).nativeElement.textContent).toBe('请输入领围');
			de.query(By.css('input[formcontrolname="sizeName"]')).nativeElement.value='S';
			de.query(By.css('input[formcontrolname="sizeName"]')).triggerEventHandler('input',{
				target: de.query(By.css('input[formcontrolname="sizeName"]')).nativeElement,
				data: 'S',
				isComposing: false, 
				inputType: "insertText",
				returnValue: true
			  });
			  fixture.detectChanges();
			expect(de.query(By.css('#td_m_neck')).nativeElement.textContent).toBe('');

			// de.query(By.css('input[type="submit"]')).nativeElement.click();
			// fixture.detectChanges();
			expect(1).toBe(1);
		});
	}));
});
