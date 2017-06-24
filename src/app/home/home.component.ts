import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../providers/auth.service";
import {AngularFireAuth} from "angularfire2/auth/auth";
import {LoginService} from "../providers/login.service";
import {AngularFireDatabase} from "angularfire2/database/database";
import {User} from "../models/user-model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  private user: User = {firstName: '', lastName: '', email: '', password: '', enterExpenses:''};

  constructor(private router: Router, private authService: AuthService, public af: AngularFireAuth, private loginService: LoginService, public db: AngularFireDatabase) {


  }


  ngOnInit() {
    this.getAllUserDetails();


  }

  logOut() {
    this.authService.signOut().then((data) => {
    }).catch(e => {
    })
  }

  getAllUserDetails() {
    let current: string = this.loginService.getUser().email;
    this.db.database.ref('users/').orderByChild('email').equalTo(current).once('value')
      .then(jsonData => {
        let obj = jsonData.toJSON();
        let key = Object.keys(obj)[0];
        this.loginService.setUserId(key);
        this.user.firstName= obj[key].firstName;
        this.user.lastName= obj[key].lastName;

      }).catch(e => {
      console.log('failed');
      console.log(e);
    })

  }


}
