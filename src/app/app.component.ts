import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

import * as firebase from 'firebase';
import { LoginService } from './services/login.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  loggedInUser = false;
  user: Observable<firebase.User>;
  loggedInSubscription: Subscription;

  constructor(private router: Router,
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    public loginService: LoginService) {

    this.loggedInSubscription = afAuth.authState.subscribe((authData: User) => {
      console.log(authData);

      if (authData && authData.email) {
        console.log(authData);
        this.loginService.setUserId(authData.uid);
        this.loginService.setUser(authData);
        this.loginService.announceUserIdCreated('user created!');
        this.router.navigate(['/view-expenses']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() { }

  ngOnDestroy() {

    this.loggedInSubscription.unsubscribe();

  }
}
