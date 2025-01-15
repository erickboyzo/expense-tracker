import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Highcharts, { AxisOptions, SeriesOptionsType } from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { Expense } from '../../../shared/interfaces/expense-model';

@Component({
  selector: 'app-category-summary-chart',
  templateUrl: './category-summary-chart.component.html',
  imports: [HighchartsChartModule],
  styleUrls: ['./category-summary-chart.component.scss'],
})
export class CategorySummaryChartComponent implements OnInit, OnChanges {
  @Input() data!: Expense[];
  @Input() date!: Date;
  @Input() categories!: string[];
  @Input() chartType: 'line' | 'column' = 'column';
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;

  chartOptions: Highcharts.Options = {
    chart: {
      plotShadow: false,
      type: this.chartType,
      backgroundColor: 'transparent',
    },
    title: {
      text: '',
    },
    plotOptions: {
      // column: {
      //   stacking: 'normal',
      //   dataLabels: {
      //     enabled: true
      //   }
      // }
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
    },
    // tooltip: {
    //   pointFormat: '{series.name}: <b>{point.y:,.2f}</b><br/>',
    //   shared: true,
    // },
    tooltip: {
      headerFormat: '<b>{category}</b><br/>',
      pointFormat: '{series.name}: ${point.y:.2f}<br/>Total: ${point.stackTotal:.2f}'
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
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
          categorySumByMonth[expenseDate.getMonth()] = categorySumByMonth[expenseDate.getMonth()] + <number>e.amount;
        }
      });
      const dataObj = { name: category, data: categorySumByMonth, type: this.chartType };
      totals.push(dataObj);
    }

    if (this.chartOptions.series?.length) {
      (this.chartOptions!.xAxis as AxisOptions)['categories'] = monthNames.map(
        (m) => `${m} ${this.date.getFullYear()}`,
      );
      this.chartOptions.series = totals as SeriesOptionsType[];
    }
    this.updateFlag = true;
  }
}
