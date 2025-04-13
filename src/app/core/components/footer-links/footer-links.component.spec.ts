import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterLinksComponent } from './footer-links.component';

describe('FooterLinksComponent', () => {
  let component: FooterLinksComponent;
  let fixture: ComponentFixture<FooterLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterLinksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
