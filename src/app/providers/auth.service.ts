import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';

@Injectable()
export class AuthService {

    user: any;

    constructor(public af: AngularFireAuth) {
    }

    signUp(email: string, pw: string) {
        console.log('sign up attempted');
        return this.af.auth.createUserWithEmailAndPassword(email, pw);
    }

    logIn(email: string, pw: string) {
        console.log('login attempted');
        return this.af.auth.signInWithEmailAndPassword(email, pw);
    }

    setLoggedInUser(data: any) {
        this.user = data;
    }

    getLoggedInUser() {
        return this.user;
    }

}
