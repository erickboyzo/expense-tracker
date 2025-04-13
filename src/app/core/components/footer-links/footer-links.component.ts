import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-footer-links',
  imports: [MatIcon, MatIconButton],
  templateUrl: './footer-links.component.html',
  styleUrl: './footer-links.component.scss',
})
export class FooterLinksComponent {
  navigateToCorrectLink(type: 'linkedin' | 'github' | 'sourceCode'): void {
    const urls = {
      linkedin: 'https://www.linkedin.com/in/erick-boyzo-258023a1/',
      github: 'https://github.com/erickboyzo',
      sourceCode: 'https://github.com/erickboyzo/expense-tracker',
    };

    window.open(urls[type], '_blank');
  }
}
