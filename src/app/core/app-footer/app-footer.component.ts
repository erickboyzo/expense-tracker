import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  isLoggedIn() {
    return (this.router.url === '/home' || this.router.url === '/dashboard');
  }

  navigateToCorrectLink(link: string) {
    let url = '';
    switch (link) {
      case 'linkedin':
        url = 'https://www.linkedin.com/in/erick-boyzo-258023a1/';
        break;

      case 'github':
        url = 'https://github.com/erickboyzo';
        break;

      case 'sourceCode':
        url = 'https://github.com/erickboyzo/expense-tracker';
        break;

      default:
        url = 'https://www.linkedin.com/in/erick-boyzo-258023a1/';
    }

    window.open(url);
  }

}
