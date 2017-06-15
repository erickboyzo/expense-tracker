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

const appRoutes: Routes = [
  { path: 'view-expenses', component: ViewLoggedExpensesComponent },
  { path: 'enter-expenses', component: LogExpenseComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ViewLoggedExpensesComponent,
    LogExpenseComponent,
    AppHeaderComponent,
    AppFooterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
     RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

