import { TestBed } from '@angular/core/testing';

import { ExpenseDataService } from './expense-data.service';

describe('ExpenseDataService', () => {
  let service: ExpenseDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
