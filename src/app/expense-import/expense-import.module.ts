import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseImportComponent } from './expense-import.component';
import { PapaParseModule } from 'ngx-papaparse';

@NgModule({
  declarations: [ExpenseImportComponent],
  exports: [ExpenseImportComponent],
  imports: [
    CommonModule,
    PapaParseModule
  ]
})
export class ExpenseImportModule { }
