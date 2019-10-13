import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';

import { ViewLoggedExpensesComponent } from './dashboard/view-logged-expenses/view-logged-expenses.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/sign-up/sign-up.component';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard']);


export const appRoutes: Routes = [
  {
    path: 'dashboard',
    component: ViewLoggedExpensesComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectLoggedInToDashboard}
  },
  {
    path: 'signUp',
    component: SignUpComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectLoggedInToDashboard}
  },
  {
    path: 'home', component: HomeComponent, canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToLogin}
  },
  {path: '', redirectTo: '/login', pathMatch: 'full'},
];


