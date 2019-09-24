import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule } from "@angular/material/sort";
import { ExpenseImportComponent } from './expense-import.component';
import { PapaParseModule } from 'ngx-papaparse';
import { ExpenseImportGridComponent } from './expense-import-grid/expense-import-grid.component';
import { MatButtonModule, MatListModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { ExpenseImportGuidanceComponent } from './expense-import-guidance/expense-import-guidance.component';

@NgModule({
  declarations: [ExpenseImportComponent, ExpenseImportGridComponent, ExpenseImportGuidanceComponent],
  exports: [ExpenseImportComponent, ExpenseImportGridComponent, ExpenseImportGuidanceComponent],
  imports: [
    CommonModule,
    PapaParseModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatButtonModule,
    MatSortModule
  ]
})
export class ExpenseImportModule {
}
