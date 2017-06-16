import { Component, OnInit } from '@angular/core';
import {User} from '../models/user-model'
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less']
})
export class SignUpComponent implements OnInit {

   currentUser: User = {firstName: 'Erick', lastName: 'b', email: 'erickb59@gmail.com', password: 'superPassword'};
   isLoading = false;

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  signUp() {
    this.isLoading = true;
    this.authService.signUp(this.currentUser.email, this.currentUser.password).then((data) => {
      this.isLoading = false;
   console.log(data);
  }).catch(e => {
     this.isLoading = false;
    console.log('Catched object set:' + e.message);
  })
  }

}
