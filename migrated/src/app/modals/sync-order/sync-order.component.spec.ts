import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncOrderComponent } from './sync-order.component';

xdescribe('SyncOrderComponent', () => {
  let component: SyncOrderComponent;
  let fixture: ComponentFixture<SyncOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
