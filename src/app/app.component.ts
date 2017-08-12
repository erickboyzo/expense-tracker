import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './providers/auth.service';
import { Observable, Subscription } from 'rxjs/Rx';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth/auth';
import { LoginService } from './providers/login.service';


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
      if (authData.email) {
        console.log(authData);
        let uid = authData.email;
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
