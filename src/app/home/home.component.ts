import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../providers/auth.service";
import {AngularFireAuth} from "angularfire2/auth/auth";
import {LoginService} from "../providers/login.service";
import {AngularFireDatabase} from "angularfire2/database/database";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  private DATABASE_REF: any;

  constructor(private router: Router, private authService: AuthService, public af: AngularFireAuth, private loginService: LoginService, public db: AngularFireDatabase) {
    this.DATABASE_REF = this.db.database.ref('users/');
  }

  ngOnInit() {
    console.log('here in home component');
    console.log(this.loginService.getUser().email);
    //this.getAllUserDetails();
  }

  logOut() {
    this.authService.signOut().then((data) => {
    }).catch(e => {
    })
  }

  getAllUserDetails(){
    let current:string = this.loginService.getUser().email;
    // this.DATABASE_REF.orderByChild("email").equalTo(current).then((snapshot) => {
    //   console.log(snap);
    // }).catch(e => {
    //   console.log(e);
    // })


    this.db.database.ref('users/').orderByChild("email").equalTo(current).once("value").then((snapshot) => {
      console.log(snapshot);
    }).catch(e => {
      console.log(e);
    })

  }


}
