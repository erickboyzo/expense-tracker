import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { Md2Module, MdNativeDateModule, NoConflictStyleCompatibilityMode } from 'md2';
import { MdlModule } from '@angular-mdl/core';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';


import { AppComponent } from './app.component';
import { ViewLoggedExpensesComponent } from './dashboard/view-logged-expenses/view-logged-expenses.component';
import { LogExpenseComponent } from './home/log-expense/log-expense.component';
import { LoginComponent } from './login/login.component';
import { LoginModule } from "./login/login.module";
import { SignUpComponent } from './signup/sign-up/sign-up.component';
import { AuthService } from './services/auth.service';
import { LoginService } from './services/login.service';
import { DatabaseService } from './services/database.service';
import { HomeComponent } from './home/home.component';
import { ChartSummaryComponent } from './dashboard/view-logged-expenses/chart-summary/chart-summary.component';
import { TableSummaryComponent } from './dashboard/view-logged-expenses/table-summary/table-summary.component';
import { ManageExpenseComponent } from './manage-expense/manage-expense.component';
import { MonthlySummaryChartComponent } from './dashboard/view-logged-expenses/monthly-summary-chart/monthly-summary-chart.component';
import { appRoutes } from './app.routes';
import { firebaseConfig } from './app.firebase.config';
import { highchartsFactory } from './app.highcharts';
import { PieGridComponent } from './dashboard/view-logged-expenses/pie-grid/pie-grid.component';
import { NumberCardsComponent } from './dashboard/view-logged-expenses/number-cards/number-cards.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ExpenseImportModule } from './home/expense-import/expense-import.module';
import { CardSpinnerModule } from './shared/card-spinner/card-spinner.module';
import { CoreModule } from "./core/core.module";
import { SignupModule } from "./signup/signup.module";

@NgModule({
  declarations: [
    AppComponent,
    ViewLoggedExpensesComponent,
    LogExpenseComponent,
    HomeComponent,
    ChartSummaryComponent,
    TableSummaryComponent,
    ManageExpenseComponent,
    MonthlySummaryChartComponent,
    PieGridComponent,
    NumberCardsComponent
  ],
  entryComponents: [
    ManageExpenseComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MdNativeDateModule,
    Md2Module,
    ChartModule,
    MdlModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSortModule,
    NoConflictStyleCompatibilityMode,
    NgxChartsModule,
    ExpenseImportModule,
    CardSpinnerModule,
    CoreModule,
    LoginModule,
    SignupModule],
  providers: [{
    provide: HighchartsStatic,
    useFactory: highchartsFactory
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}

