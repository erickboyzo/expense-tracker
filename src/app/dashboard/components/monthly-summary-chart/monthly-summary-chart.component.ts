import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SeriesOptionsType } from 'highcharts';
import * as Highcharts from 'highcharts';
import { HighchartsChartComponent, HighchartsChartModule } from 'highcharts-angular';
import { ResponsiveService } from '../../../shared/services/responsive.service';
import { Expense } from '../../../core/interfaces/expense-model';

@Component({
  selector: 'app-monthly-summary-chart',
  templateUrl: './monthly-summary-chart.component.html',
  styleUrls: ['./monthly-summary-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HighchartsChartModule, MatIcon],
})
export class MonthlySummaryChartComponent implements OnInit, OnChanges {
  readonly responsiveService = inject(ResponsiveService);
  readonly isHandset = this.responsiveService.isHandset;

  @Input() data!: Expense[];
  @Input() date!: Date;
  @Input() categories!: string[];
  @ViewChild('chart') chart!: HighchartsChartComponent;

  currentData: Expense[] = [];
  originalData: Expense[] = [];

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  chartOptions: Highcharts.Options = {
    chart: {
      plotShadow: false,
      type: 'column',
      backgroundColor: 'transparent',
      scrollablePlotArea: {
        minWidth: this.isHandset() ? 800 : undefined,
        scrollPositionX: 0,
      },
    },
    title: {
      text: '',
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: this.isHandset() ? -45 : 0,
        style: {
          fontSize: this.isHandset() ? '8px' : '12px',
        },
      },
    },
    yAxis: {
      title: {
        text: 'Total monthly expense amount',
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '${point.y:.1f}',
        },
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>${point.y:.2f}</b> <br/>',
    },
    series: [
      {
        type: 'column',
        data: [],
      },
    ],
    drilldown: {
      breadcrumbs: {
        position: {
          align: 'right',
        },
      },
    },
  };

  ngOnInit() {
    this.originalData = [...this.data];
    this.currentData = this.data;
    this.setDataForMonthRange();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      if (this.chartOptions) {
        this.originalData = [...this.data];
        this.currentData = this.data;
        this.setDataForMonthRange();
      }
    }

    if (changes['date'] && !changes['date'].firstChange) {
      if (this.date) {
        this.setDataForMonthRange();
      }
    }
  }

  setDataForMonthRange() {
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

    const monthRange = this.getDateRange();

    const monthSummary = [];
    const drillDown = [];
    for (const month of monthRange) {
      let monthSum = 0;
      const drillDownData = [];

      for (const expense of this.currentData) {
        const currentDate = new Date(expense.date);
        if (month.getMonth() === currentDate.getMonth() && month.getFullYear() === currentDate.getFullYear()) {
          monthSum += +expense.amount as number;
          drillDownData.push(expense);
        }
      }
      let parsedSum;
      if (monthSum !== 0) {
        parsedSum = monthSum.toFixed(2);
      }

      monthSummary.push({
        name: `${monthNames[month.getMonth()]} ${month.getFullYear()}`,
        y: parseFloat(parsedSum ?? ''),
        drilldown: monthNames[month.getMonth()],
      });
      drillDown.push({
        name: monthNames[month.getMonth()],
        id: monthNames[month.getMonth()],
        data: this.getDrillDownData(drillDownData),
      });
    }
    if (this.chartOptions.series?.length) {
      this.chartOptions.series[0] = {
        type: 'column',
        data: monthSummary,
      };
    }

    if (this.chartOptions.drilldown?.series?.length) {
      this.chartOptions.drilldown.series = drillDown as SeriesOptionsType[];
    }
    this.updateFlag = true;
  }

  getDrillDownData(data: Expense[]): [string, number][] {
    const summaryData: [string, number][] = [];

    for (const category of this.categories) {
      let categorySum = 0;
      for (const expense of data) {
        if (category === expense.category) {
          categorySum += +expense.amount;
        }
      }
      summaryData.push([category, categorySum]);
    }
    return summaryData;
  }

  getDateRange(): Date[] {
    const monthRange = [this.date];
    for (let i = 1; i < 12; i++) {
      const month = new Date(this.date.getTime());
      month.setMonth(this.date.getMonth() + i);
      monthRange.push(month);
    }
    return monthRange;
  }
}
