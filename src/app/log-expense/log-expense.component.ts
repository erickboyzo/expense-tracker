import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database/database";
import {LoginService} from "../providers/login.service";

@Component({
  selector: 'app-log-expense',
  templateUrl: './log-expense.component.html',
  styleUrls: ['./log-expense.component.less']
})
export class LogExpenseComponent implements OnInit {

  constructor(public db: AngularFireDatabase,private loginService:LoginService) { }

  ngOnInit() {
    this.pushData();
  }

  pushData(){
    //email
    var userid = this.loginService.getUser().email;
    console.log(userid);
   this.db.database.ref('users/testUser').set({
      username: 'Test User',
      email: userid,
    });
  }

}
