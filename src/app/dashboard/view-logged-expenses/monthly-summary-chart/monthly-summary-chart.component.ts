import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Expense } from '../../../shared/interfaces/expense-model';

@Component({
  selector: 'app-monthly-summary-chart',
  templateUrl: './monthly-summary-chart.component.html',
  styleUrls: ['./monthly-summary-chart.component.scss']
})
export class MonthlySummaryChartComponent implements OnInit, OnChanges {

  @Input() data: Expense[];
  @Input() date: Date;
  @Input() categories: string[];
  currentData: Expense[];
  originalData: Expense[];

  chart: any;
  options = {
    chart: {
      type: 'column'
    },
    title: {
      text: ''
    },
    subtitle: {
      text: 'Click the columns to view month details'
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Total monthly expense amount'
      }

    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '${point.y:.2f}'
        }
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>${point.y:.2f}</b> <br/>'
    },

    series: [{
      name: 'Months',
      colorByPoint: true,
      data: []
    }],
    drilldown: {
      series: []
    }
  };


  ngOnInit() {
    this.originalData = [...this.data];
    this.currentData = this.data;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && !changes.data.firstChange) {
      if (this.chart) {
        this.originalData = [...this.data];
        this.currentData = this.data;
        this.setDataForMonthRange();
      }
    }

    if (changes.date && !changes.date.firstChange) {
      if (this.date) {
        this.setDataForMonthRange();
      }
    }
  }

  saveInstance(chartInstance: any) {
    this.chart = chartInstance;
    this.setDataForMonthRange();
  }

  setDataForMonthRange() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
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
          monthSum += expense.amount as number;
          drillDownData.push(expense);
        }
      }
      let parsedSum;
      if (monthSum !== 0) {
        parsedSum = monthSum.toFixed(2);
      }
      monthSummary.push({
        name: monthNames[month.getMonth()] + month.getFullYear(),
        y: parseFloat(parsedSum),
        drilldown: monthNames[month.getMonth()]
      });
      drillDown.push({
        name: monthNames[month.getMonth()],
        id: monthNames[month.getMonth()],
        data: this.getDrillDownData(drillDownData)
      });
    }
    this.chart.series[0].setData(monthSummary);
    this.chart.options.drilldown.series = drillDown;
  }

  getDrillDownData(data: any) {

    const summaryData = [];

    for (const category of this.categories) {
      let categorySum = 0;
      for (const expense of data) {
        if (category === expense.category) {
          categorySum += expense.amount;
        }
      }
      summaryData.push([category, categorySum]);
    }
    return summaryData;
  }

  getDateRange() {
    const monthRange = [this.date];
    for (let i = 1; i < 6; i++) {
      const month = new Date(this.date.getTime());
      month.setMonth(this.date.getMonth() + i);
      monthRange.push(month);
    }
    return monthRange;
  }


}
