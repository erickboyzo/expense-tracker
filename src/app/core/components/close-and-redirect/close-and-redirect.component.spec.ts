import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseAndRedirectComponent } from './close-and-redirect.component';

describe('CloseAndRedirectComponent', () => {
  let component: CloseAndRedirectComponent;
  let fixture: ComponentFixture<CloseAndRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseAndRedirectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CloseAndRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
