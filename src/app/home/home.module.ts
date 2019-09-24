import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { Md2ChipsModule, Md2DatepickerModule } from "md2";
import { CardSpinnerModule } from "../shared/card-spinner/card-spinner.module";
import { ExpenseImportModule } from "./expense-import/expense-import.module";
import { HomeComponent } from "./home.component";
import { LogExpenseComponent } from "./log-expense/log-expense.component";

@NgModule({
  declarations: [LogExpenseComponent, HomeComponent],

  imports: [
    CommonModule,
    ExpenseImportModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    Md2DatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    Md2ChipsModule,
    MatStepperModule,
    CardSpinnerModule,
    MatDatepickerModule
  ],
  exports: [HomeComponent]
})
export class HomeModule {
}

