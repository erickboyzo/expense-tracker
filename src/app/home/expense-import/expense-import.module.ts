import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { ExpenseImportComponent } from './expense-import.component';
import { ExpenseImportGridComponent } from './expense-import-grid/expense-import-grid.component';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ExpenseImportGuidanceComponent } from './expense-import-guidance/expense-import-guidance.component';

@NgModule({
  declarations: [ExpenseImportComponent, ExpenseImportGridComponent, ExpenseImportGuidanceComponent],
  exports: [ExpenseImportComponent, ExpenseImportGridComponent, ExpenseImportGuidanceComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatListModule,
    MatButtonModule,
    MatSortModule
  ]
})
export class ExpenseImportModule {
}
