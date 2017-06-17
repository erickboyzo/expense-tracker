import { Component, OnInit } from '@angular/core';
import {User} from '../models/user-model'
import { AuthService } from '../providers/auth.service';
import {MdSnackBar} from "@angular/material";
import {Routes, Router} from "@angular/router";


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less']
})
export class SignUpComponent implements OnInit {

   currentUser: User = {firstName: '', lastName: '', email: '', password: ''};
   isLoading = false;

  constructor(public authService: AuthService, public snackBar: MdSnackBar, private router:Router) { }

  ngOnInit() {
  }

  signUp() {
    this.isLoading = true;
    this.authService.signUp(this.currentUser.email, this.currentUser.password).then((data) => {
      this.isLoading = false;
      this.openSnackBarSuccess();
      this.onSuccessfulSignUp();
  }).catch(e => {
     this.isLoading = false;
     this.openSnackBarError(e.message);
    console.log('Catched object set:' + e.message);
  })
  }

  updateUserInfo(user:any){
    var displayName:string = this.currentUser.firstName + ' '+ this.currentUser.lastName;
    this.authService.updateUserProfile(user,displayName).then((data) => {
      this.isLoading = false;
      this.openSnackBarSuccess();
      this.onSuccessfulSignUp();
      console.log(data);
    }).catch(e => {
      this.isLoading = false;
      console.log('Catched object set:' + e.message);
    })
  }

  openSnackBarSuccess(){
    this.snackBar.open('Successful Registration!','',{duration:2000});
  }
  openSnackBarError(message:string){
    this.snackBar.open(message,'ok',{duration:4000});
  }

  onSuccessfulSignUp(){
    this.router.navigate(['/home']);
  }


}
