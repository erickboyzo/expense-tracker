import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthService {

  constructor(public af: AngularFireAuth) { }

signUp(email: string, pw: string) {
console.log('sign up attempted');
return this.af.auth.createUserWithEmailAndPassword(email , pw);
}

}
