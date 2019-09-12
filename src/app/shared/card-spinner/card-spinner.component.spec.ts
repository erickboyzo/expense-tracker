import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSpinnerComponent } from './card-spinner.component';

describe('CardSpinnerComponent', () => {
  let component: CardSpinnerComponent;
  let fixture: ComponentFixture<CardSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
