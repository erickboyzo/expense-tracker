import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartEvent } from 'angular2-highcharts/dist/ChartEvent';
import { Expense } from '../../../shared/interfaces/expense-model';

@Component({
  selector: 'app-category-summary-chart',
  templateUrl: './category-summary-chart.component.html',
  styleUrls: ['./category-summary-chart.component.scss']
})
export class CategorySummaryChartComponent implements OnInit, OnChanges {
  @Input() data: Expense[];
  @Input() date: Date;
  @Input() categories: string[];

  init = false;
  chart: any;
  options = {
    title: {
      text: null
    },
    xAxis: {
      categories: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y:,.2f}</b><br/>',
      shared: true
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom'
    },
    series: []
  };


  constructor() {
  }

  ngOnInit() {
    this.setCategoriesData();
    this.init = true;
  }

  saveInstance(chartInstance: ChartEvent) {
    this.chart = chartInstance;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && !changes.data.firstChange) {
      if (this.chart) {
        this.setCategoriesData(true);
      }
    }

    if (changes.date && !changes.date.firstChange) {
      if (this.date) {
        this.setCategoriesData(true);
      }
    }
  }

  setCategoriesData(update: boolean = false) {
    const totals = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    for (const category of this.categories) {
      const categorySumByMonth = monthNames.map(e => 0);
      const matchingExpenses = this.data.filter(c => c.category === category);
      matchingExpenses.forEach(e => {
        const expenseDate = new Date(e.date);
        if (expenseDate.getFullYear() === this.date.getFullYear()) {
          categorySumByMonth[expenseDate.getMonth()] = categorySumByMonth[expenseDate.getMonth()] + <number>e.amount;
        }
      });
      const dataObj = {name: category, data: categorySumByMonth, type: 'line'};
      totals.push(dataObj);
    }
    this.options.series = totals;
    this.options.xAxis.categories = monthNames.map(m => `${m} ${this.date.getFullYear()}`);
    if (update) {
      this.chart.update(this.options);
    }
  }

}
