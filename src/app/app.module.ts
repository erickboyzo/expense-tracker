import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MaterialModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';

import {ChartModule} from 'angular2-highcharts';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import {HighchartsDrilldown} from 'highcharts/modules/drilldown';


import {ViewLoggedExpensesComponent} from './view-logged-expenses/view-logged-expenses.component';
import {LogExpenseComponent} from './log-expense/log-expense.component';
import {AppHeaderComponent} from './app-header/app-header.component';
import {AppFooterComponent} from './app-footer/app-footer.component';
import {LoginComponent} from './login/login.component';
import {SignUpComponent} from './sign-up/sign-up.component';

import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {AngularFireAuthModule, AngularFireAuth} from 'angularfire2/auth';
import {MdNativeDateModule} from '@angular/material';
import {ChartsModule} from 'ng2-charts/ng2-charts';


import {AuthService} from './providers/auth.service';
import {LoginService} from './providers/login.service';
import {DatabaseService} from './providers/database.service';
import {HomeComponent} from './home/home.component';
import {ChartSummaryComponent} from './view-logged-expenses/chart-summary/chart-summary.component';
import {TableSummaryComponent} from './view-logged-expenses/table-summary/table-summary.component';
import {ManageExpenseComponent} from './manage-expense/manage-expense.component';
import {Md2Module} from "md2";
import {MdlModule} from "@angular-mdl/core";
import {MonthlySummaryChartComponent} from './view-logged-expenses/monthly-summary-chart/monthly-summary-chart.component';
import {appRoutes} from "./app.routes";
import {firebaseConfig} from "./app.firebase.config";
import {highchartsFactory} from "./app.highcharts";


@NgModule({
  declarations: [
    AppComponent,
    ViewLoggedExpensesComponent,
    LogExpenseComponent,
    AppHeaderComponent,
    AppFooterComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent,
    ChartSummaryComponent,
    TableSummaryComponent,
    ManageExpenseComponent,
    MonthlySummaryChartComponent
  ],
  entryComponents: [
    ManageExpenseComponent,
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
    AngularFireAuthModule,
    MdNativeDateModule,
    ChartsModule,
    Md2Module,
    ChartModule,
    MdlModule
  ],
  providers: [AuthService,
    LoginService,
    DatabaseService,
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}

