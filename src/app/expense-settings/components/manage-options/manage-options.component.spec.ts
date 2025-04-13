import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOptionsComponent } from './manage-options.component';

describe('ManageOptionsComponent', () => {
  let component: ManageOptionsComponent;
  let fixture: ComponentFixture<ManageOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
