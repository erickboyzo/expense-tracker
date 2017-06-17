import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {LoginService} from "../providers/login.service";
import {Router} from "@angular/router";
import {MdSnackBar} from "@angular/material";
import {AuthService} from "../providers/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.less']
})
export class AppHeaderComponent implements OnInit {

  title = "Expenses Tracker";

  constructor(private loginService: LoginService, private router: Router, public authService: AuthService, public snackBar: MdSnackBar) {
  }

  ngOnInit() {
  }

  shouldDisplay() {
    return (this.router.url === '/home' || this.router.url === '/view-expenses' || this.router.url === '/enter-expenses');
  }

  logOut(){
    this.authService.signOut().then((data) => {
      console.log(data);
      console.log('Logged out successful');
      this.router.navigate(['/login']);
      this.snackBar.open('Logged out!','',{duration:2000});

    }).catch(e => {
      console.log('Catches object set:' + e.message);
      this.snackBar.open(e.message,'',{duration:2000});
    })
  }



}
