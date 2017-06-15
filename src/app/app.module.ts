import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MaterialModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { ViewLoggedExpensesComponent } from './view-logged-expenses/view-logged-expenses.component';
import { LogExpenseComponent } from './log-expense/log-expense.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { LoginComponent } from './login/login.component';

import { AngularFireModule } from 'angularfire2';

// New imports to update based on AngularFire2 version 4
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import { SignUpComponent } from './sign-up/sign-up.component';

export const firebaseConfig = {
  apiKey: "AIzaSyAdENYvQg1gI_1pONInILcbQNX_Ji4Bss8",
  authDomain: "expense-tracker-e0028.firebaseapp.com",
  databaseURL: "https://expense-tracker-e0028.firebaseio.com",
  projectId: "expense-tracker-e0028",
  storageBucket: "expense-tracker-e0028.appspot.com",
  messagingSenderId: "927113629451"
};

const appRoutes: Routes = [
  { path: 'view-expenses', component: ViewLoggedExpensesComponent },
  { path: 'enter-expenses', component: LogExpenseComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ViewLoggedExpensesComponent,
    LogExpenseComponent,
    AppHeaderComponent,
    AppFooterComponent,
    LoginComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
     RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

