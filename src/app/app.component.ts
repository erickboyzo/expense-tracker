import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./providers/auth.service";
import {Observable} from "rxjs";
import {AngularFireAuth} from "angularfire2/auth/auth";
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  loggedInUser:any;
  user: Observable<firebase.User>;


  constructor(private router:Router, private authService:AuthService, public af: AngularFireAuth) {

    this.af.auth.onAuthStateChanged(this.onStateChange);
    if(!firebase.auth().currentUser == null){
      console.log("User found going home");
      this.routeHome();
    }else{
      console.log("User not found going to login");
      this.routeLogin();
    }
  }

  ngOnInit() {
    console.log("in the ngonInit--- app root");
    console.log(firebase.auth().currentUser);
    console.log(this.user);

    this.loggedInUser = firebase.auth().currentUser;


  }

  onStateChange(user:any){
    console.log('state changed!');
    console.log(user);
  }

  public routeLogin(){
    this.router.navigate(['/login']);
  }
  public routeHome(){
    this.router.navigate(['/home']);
  }
}
