import { redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { Routes } from '@angular/router';
import { CloseAndRedirectComponent } from './core/close-and-redirect/close-and-redirect.component';
import { YearDataSelectorComponent } from './core/year-data-selector/year-data-selector.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['dashboard']);

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    pathMatch: 'full',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToItems },
  },
  {
    path: 'dashboard',
    pathMatch: 'full',
    loadComponent: () =>
      import('./dashboard/view-logged-expenses/view-logged-expenses.component').then(
        (m) => m.ViewLoggedExpensesComponent,
      ),
    canActivate: [AngularFireAuthGuard],
    title: 'Dashboard',
    data: { authGuardPipe: redirectUnauthorizedToLogin, title: 'Dashboard', pageActions: YearDataSelectorComponent },
  },
  {
    path: 'settings',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin, title: 'Settings', pageActions: CloseAndRedirectComponent, fixedContainer: true },
  },
  {
    path: 'new-expense',
    pathMatch: 'full',
    loadComponent: () => import('./log-expense/log-expense.component').then((m) => m.LogExpenseComponent),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin, title: 'New Expense', pageActions: CloseAndRedirectComponent, fixedContainer: true },
  },

  {
    path: 'import-expenses',
    pathMatch: 'full',
    loadComponent: () => import('./import-expenses/import-expenses.component').then((m) => m.ImportExpensesComponent),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin, title: 'Import Expenses', pageActions: CloseAndRedirectComponent },
  },
];
