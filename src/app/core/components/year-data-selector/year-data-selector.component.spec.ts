import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearDataSelectorComponent } from './year-data-selector.component';

describe('YearDataSelectorComponent', () => {
  let component: YearDataSelectorComponent;
  let fixture: ComponentFixture<YearDataSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearDataSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YearDataSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
