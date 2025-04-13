import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { NumberCardsComponent } from './number-cards.component';

describe('NumberCardsComponent', () => {
  let component: NumberCardsComponent;
  let fixture: ComponentFixture<NumberCardsComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NumberCardsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
