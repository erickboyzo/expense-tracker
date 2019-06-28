import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

import * as firebase from 'firebase';
import { LoginService } from './services/login.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent implements OnInit, OnDestroy {
  loggedInUser = false;
  user: Observable<firebase.User>;
  email: any;
  loggedInSubscription: Subscription;

  constructor(private router: Router,
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    public loginService: LoginService) {

    this.loggedInSubscription = afAuth.authState.subscribe(authData => {
      console.log(authData);
      if (authData && authData.email) {
        console.log(authData);
        const uid = authData.email;
        this.email = uid;
        console.log(this.email);
        this.loginService.setUser(authData);
        this.loginService.announceUserIdCreated('user created!');
        this.router.navigate(['/home']);
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
