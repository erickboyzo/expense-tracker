import { Component, inject, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { WINDOW } from '@core/tokens/window.token';
import { format } from 'date-fns';
import { Papa } from 'ngx-papaparse';
import { Expense } from '../../interfaces/expense-model';

@Component({
  selector: 'app-data-export',
  imports: [MatIcon, MatButton],
  templateUrl: './data-export.component.html',
  styleUrl: './data-export.component.scss',
})
export class DataExportComponent {
  @Input() data: Expense[] = [];
  @Input() fileName = 'expenses-export';

  private papa = inject(Papa);
  private readonly window = inject(WINDOW);

  exportData() {
    if (!this.data || this.data.length === 0) {
      return;
    }

    const csv = this.papa.unparse({
      fields: this.getHeaders(),
      data: this.formatDataForExport(this.data),
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    this.downloadFile(blob, `${this.fileName}-${this.getFormattedDate()}.csv`);
  }

  private getHeaders(): string[] {
    return ['Name', 'Amount', 'Date', 'Category', 'Type', 'Comments'];
  }

  private formatDataForExport(data: Expense[]): any[] {
    return data.map((expense) => {
      return {
        Name: expense.name ?? '',
        Amount: expense.amount,
        Date: this.formatDate(expense.date),
        Category: expense.category ?? '',
        Type: expense.type ?? '',
        Comments: expense.comments ?? '',
      };
    });
  }

  private formatDate(date: Date | string): string {
    if (!date) return '';

    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return format(parsedDate, 'MM-dd-yyyy');
      }
      return date;
    }
    return date.toLocaleDateString();
  }

  private getFormattedDate(): string {
    const now = new Date();
    return format(now, 'MM-dd-yyyy HH-mm-ss');
  }

  private downloadFile(blob: Blob, filename: string): void {
    const link = this.window.document.createElement('a');

    const url = this.window.window.URL.createObjectURL(blob);

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      this.window.window.URL.revokeObjectURL(url);
    }, 100);
  }
}
