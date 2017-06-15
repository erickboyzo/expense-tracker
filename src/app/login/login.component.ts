///<reference path="../../../node_modules/@types/node/index.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {


    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    public signUp() {
        this.router.navigate(['/signUp']);
    }

    public login() {
        console.log('Attempted log in');
    }

}
