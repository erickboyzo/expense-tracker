import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { PieChartModule } from "@swimlane/ngx-charts";
import { ChartModule } from "angular2-highcharts";
import { HighchartsStatic } from "angular2-highcharts/dist/HighchartsService";
import { highchartsFactory } from "../app.highcharts";
import { ManageExpenseComponent } from "./manage-expense/manage-expense.component";
import { CardSpinnerModule } from "../shared/card-spinner/card-spinner.module";
import { ChartSummaryComponent } from "./view-logged-expenses/chart-summary/chart-summary.component";
import { MonthlySummaryChartComponent } from "./view-logged-expenses/monthly-summary-chart/monthly-summary-chart.component";
import { NumberCardsComponent } from "./view-logged-expenses/number-cards/number-cards.component";
import { PieGridComponent } from "./view-logged-expenses/pie-grid/pie-grid.component";
import { TableSummaryComponent } from "./view-logged-expenses/table-summary/table-summary.component";
import { ViewLoggedExpensesComponent } from "./view-logged-expenses/view-logged-expenses.component";

@NgModule({
  declarations: [
    ChartSummaryComponent,
    TableSummaryComponent,
    ManageExpenseComponent,
    MonthlySummaryChartComponent,
    PieGridComponent,
    NumberCardsComponent,
    ViewLoggedExpensesComponent,
    ManageExpenseComponent],
  imports: [
    CommonModule,
    ChartModule,
    MatCardModule,
    MatProgressBarModule,
    CardSpinnerModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    PieChartModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  exports: [
    ViewLoggedExpensesComponent
  ],
  entryComponents: [
    ManageExpenseComponent,
  ],
  providers:[{
    provide: HighchartsStatic,
    useFactory: highchartsFactory
  }]

})
export class DashboardModule {
}
