import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ExpenseDataService } from '../../shared/services/expense-data.service';

@Component({
  selector: 'app-year-data-selector',
  imports: [MatDatepickerModule, ReactiveFormsModule, FormsModule, MatButton, MatIcon, DatePipe, MatSlideToggle, NgIf],
  templateUrl: './year-data-selector.component.html',
  styleUrl: './year-data-selector.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearDataSelectorComponent {
  today = new Date();
  dateRangeEnabled = false;
  range = new FormGroup({
    start: new FormControl<Date | null>(new Date(this.today.getFullYear(), 0, 1)),
    end: new FormControl<Date | null>(this.today),
  });

  private dataService: ExpenseDataService = inject(ExpenseDataService);
  expenses = this.dataService.expensesSignal;

  click() {
    console.log(this.range.value);
  }
}
