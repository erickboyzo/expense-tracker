import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../providers/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(private router:Router, private authService:AuthService) {}

  ngOnInit() {
  }

  logOut(){
    this.authService.signOut().then((data) => {
    }).catch(e => {
    })
  }


}
