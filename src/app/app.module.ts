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
  MatGridListModule, MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule, MatPaginatorModule, MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule, MatSortModule,
  MatStepperModule, MatTableModule,
  MatTabsModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';


import { AppComponent } from './app.component';
import { ViewLoggedExpensesComponent } from './view-logged-expenses/view-logged-expenses.component';
import { LogExpenseComponent } from './log-expense/log-expense.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthService } from './services/auth.service';
import { LoginService } from './services/login.service';
import { DatabaseService } from './services/database.service';
import { HomeComponent } from './home/home.component';
import { ChartSummaryComponent } from './view-logged-expenses/chart-summary/chart-summary.component';
import { TableSummaryComponent } from './view-logged-expenses/table-summary/table-summary.component';
import { ManageExpenseComponent } from './manage-expense/manage-expense.component';
import { MonthlySummaryChartComponent } from './view-logged-expenses/monthly-summary-chart/monthly-summary-chart.component';
import { appRoutes } from './app.routes';
import { firebaseConfig } from './app.firebase.config';
import { highchartsFactory } from './app.highcharts';
import { PieGridComponent } from './view-logged-expenses/pie-grid/pie-grid.component';
import { NumberCardsComponent } from './view-logged-expenses/number-cards/number-cards.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ExpenseImportModule } from './expense-import/expense-import.module';
import { CardSpinnerModule } from './card-spinner/card-spinner.module';
import { CovalentLayoutModule } from "@covalent/core";

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
    CovalentLayoutModule
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

