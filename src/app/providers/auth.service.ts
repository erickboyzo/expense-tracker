import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router} from "@angular/router";


@Injectable()
export class AuthService {

    user: any = null;

    constructor(public af: AngularFireAuth, private router:Router) {
    }

    signUp(email: string, pw: string) {
        console.log('sign up attempted');
        return this.af.auth.createUserWithEmailAndPassword(email, pw);
    }

    logIn(email: string, pw: string) {
        console.log('login attempted');
        return this.af.auth.signInWithEmailAndPassword(email, pw);
    }

    updateUserProfile(user:any,displayName:string){
        // var currentUser:any=firebase.auth().currentUser;
      console.log(user);
        return user.updateUserProfile({displayName: displayName, photoURL:'' });
    }


    setLoggedInUser(data: any) {
        this.user = data;
    }

    getLoggedInUser() {
        return this.user;
    }

    getUser() {
         this.af.auth.onAuthStateChanged(function (user) {
            if (user) {
                console.log(user);
                return user;
                // ...
            } else {
                console.log('no user or logged out!!!!');
                return null;
            }
        });
    }

    signOut() {
        return this.af.auth.signOut();
    }


}
