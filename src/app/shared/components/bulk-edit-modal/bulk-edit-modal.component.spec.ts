import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkEditModalComponent } from './bulk-edit-modal.component';

describe('BulkEditModalComponent', () => {
  let component: BulkEditModalComponent;
  let fixture: ComponentFixture<BulkEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkEditModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
