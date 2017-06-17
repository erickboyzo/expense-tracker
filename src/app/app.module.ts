import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { ViewLoggedExpensesComponent } from './view-logged-expenses/view-logged-expenses.component';
import { LogExpenseComponent } from './log-expense/log-expense.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';



import { AuthService } from './providers/auth.service';
import { LoginService } from './providers/login.service';
import { HomeComponent } from './home/home.component';

export const firebaseConfig = {
  apiKey: 'AIzaSyAdENYvQg1gI_1pONInILcbQNX_Ji4Bss8',
  authDomain: 'expense-tracker-e0028.firebaseapp.com',
  databaseURL: 'https://expense-tracker-e0028.firebaseio.com',
  projectId: 'expense-tracker-e0028',
  storageBucket: 'expense-tracker-e0028.appspot.com',
  messagingSenderId: '927113629451'
};

const appRoutes: Routes = [
  { path: 'view-expenses', component: ViewLoggedExpensesComponent },
  { path: 'enter-expenses', component: LogExpenseComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'home', component: HomeComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ViewLoggedExpensesComponent,
    LogExpenseComponent,
    AppHeaderComponent,
    AppFooterComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent
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
  providers: [AuthService,LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }

