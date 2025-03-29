import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipListbox, MatChipOption, MatChipSelectionChange } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ExpenseDataService } from '../../shared/services/expense-data.service';
import { TimeFrameFilter } from '../interfaces/time-frame-filter';

@Component({
  selector: 'app-year-data-selector',
  imports: [
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    MatButton,
    MatIcon,
    DatePipe,
    NgIf,
    MatCardModule,
    MatChipListbox,
    MatChipOption,
    NgForOf,
    MatLabel,
  ],
  templateUrl: './year-data-selector.component.html',
  styleUrl: './year-data-selector.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearDataSelectorComponent implements OnInit, OnDestroy {
  today = new Date();
  dateRangeEnabled = false;
  range = new FormGroup({
    start: new FormControl<Date | null>(new Date(this.today.getFullYear(), 0, 1)),
    end: new FormControl<Date | null>(this.today),
  });

  timeFrameFilters: TimeFrameFilter[] = [
    {
      label: 'Current Month',
      value: 'currentMonth',
      getDates: () => ({
        start: new Date(this.today.getFullYear(), this.today.getMonth(), 1),
        end: this.today,
      }),
    },
    {
      label: 'Last 3 Months',
      value: '3months',
      getDates: () => {
        const start = new Date(this.today);
        start.setMonth(start.getMonth() - 2, 1);
        return {
          start,
          end: this.today,
        };
      },
    },
    {
      label: 'Last 6 Months',
      value: '6months',
      getDates: () => {
        const start = new Date(this.today);
        start.setMonth(start.getMonth() - 5, 1);
        return {
          start,
          end: this.today,
        };
      },
    },
    {
      label: 'Custom Date Range',
      value: 'custom range',
      getDates: () => {
        return {
          start: new Date(this.today.getFullYear(), 0, 1),
          end: this.today,
        };
      },
    },
  ];

  private dataService: ExpenseDataService = inject(ExpenseDataService);
  expenses = this.dataService.expensesSignal;
  showFilter = this.dataService.showFilter;
  filter = this.dataService.timeFrameFilterSignal;
  selectedTimeFrame: string | null = this.dataService.timeFrameFilterSignal()?.value ?? null;

  private subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.range.valueChanges.subscribe((value) => {
        const { start, end } = value;
        const timeFrameFilter: TimeFrameFilter = {
          ...(this.dataService.timeFrameFilterSignal() as TimeFrameFilter),
          customDateRange: { start: start as Date, end: end as Date },
        };
        this.dataService.setTimeFrameFilter(timeFrameFilter);
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  click() {
    console.log(this.range.value);
  }

  toggleFilters() {
    this.showFilter.update((value) => !value);
  }

  onTimeFrameChange(event: MatChipSelectionChange, filter: TimeFrameFilter) {
    if (event.selected) {
      const { start, end } = filter.getDates();
      this.range.patchValue({ start, end });
      this.dateRangeEnabled = filter.value === 'custom range';
      this.dataService.setTimeFrameFilter(filter);
    } else {
      this.dateRangeEnabled = false;
      this.range.patchValue({ start: null, end: null });
      this.dataService.setTimeFrameFilter(undefined);
    }
  }
}
