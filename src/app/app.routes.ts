import { Routes } from '@angular/router';

import { ViewLoggedExpensesComponent } from './view-logged-expenses/view-logged-expenses.component';
import { LogExpenseComponent } from './log-expense/log-expense.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';

export const appRoutes: Routes = [
  { path: 'view-expenses', component: ViewLoggedExpensesComponent },
  { path: 'enter-expenses', component: LogExpenseComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
