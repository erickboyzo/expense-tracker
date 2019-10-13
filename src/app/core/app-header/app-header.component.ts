import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {

  title = 'Expense Tracker';

  constructor(private router: Router,
    public authService: AuthService,
    public snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  shouldDisplay() {
    return (this.router.url === '/home' || this.router.url === '/dashboard');
  }

  logOut() {
    this.authService.signOut().then((data) => {
      this.router.navigate(['/login']);
      this.snackBar.open('Logged out!', '', { duration: 2000 });

    }).catch(e => {
      console.log('Catches object set:' + e.message);
      this.snackBar.open(e.message, '', { duration: 2000 });
    })
  }

}
