import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import Highcharts, { AxisOptions, SeriesOptionsType } from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ResponsiveService } from '@shared/services/responsive.service';
import { Expense } from '@core/interfaces/expense-model';

@Component({
  selector: 'app-category-summary-chart',
  templateUrl: './category-summary-chart.component.html',
  imports: [HighchartsChartModule, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./category-summary-chart.component.scss'],
})
export class CategorySummaryChartComponent implements OnInit, OnChanges {
  readonly responsiveService = inject(ResponsiveService);
  readonly isHandset = this.responsiveService.isHandset;

  @Input() data!: Expense[];
  @Input() date!: Date;
  @Input() categories!: string[];
  @Input() chartType: 'line' | 'column' = 'column';

  updateFlag = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      plotShadow: false,
      type: this.chartType,
      backgroundColor: 'transparent',
      scrollablePlotArea: {
        minWidth: this.isHandset() ? 800 : undefined,
        scrollPositionX: 0,
      },
    },
    title: {
      text: '',
    },
    plotOptions: {
      series: {
        states: {
          hover: {
            enabled: !this.isHandset(),
          },
        },
      },
    },
    yAxis: {
      title: {
        text: 'Category Amount',
      },
    },
    xAxis: {
      categories: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      labels: {
        rotation: this.isHandset() ? -45 : 0,
        style: {
          fontSize: this.isHandset() ? '8px' : '12px',
        },
      },
    },
    tooltip: {
      headerFormat: '<b>{category}</b><br/>',
      pointFormat: '{series.name}: ${point.y:.2f}<br/>Total: ${point.stackTotal:.2f}',
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      enabled: true,
      itemStyle: {
        fontSize: this.isHandset() ? '8px' : '12px',
      },
    },
    series: [
      {
        type: this.chartType,
        data: [],
      },
    ],
  };

  ngOnInit() {
    this.setCategoriesData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.setCategoriesData();
    }

    if (changes['date'] && !changes['date'].firstChange) {
      this.setCategoriesData();
    }

    if (changes['chartType'] && !changes['chartType'].firstChange) {
      this.chartType = changes['chartType'].currentValue;
      this.setCategoriesData();
    }
  }

  setCategoriesData() {
    const totals = [];
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    for (const category of this.categories) {
      const categorySumByMonth = monthNames.map(() => 0);
      const matchingExpenses = this.data.filter((c) => c.category === category);
      matchingExpenses.forEach((e) => {
        const expenseDate = new Date(e.date);
        if (expenseDate.getFullYear() === this.date.getFullYear()) {
          categorySumByMonth[expenseDate.getMonth()] = categorySumByMonth[expenseDate.getMonth()] + +e.amount;
        }
      });
      const dataObj = { name: category, data: categorySumByMonth };
      totals.push(dataObj);
    }
    (this.chartOptions!.xAxis as AxisOptions)['categories'] = monthNames.map((m) => `${m} ${this.date.getFullYear()}`);
    (this.chartOptions.chart ?? {})['type'] = this.chartType;
    this.chartOptions.series = totals as SeriesOptionsType[];
    this.updateFlag = true;
  }
}
