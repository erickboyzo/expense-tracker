import {Component, OnInit, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-monthly-summary-chart',
  templateUrl: './monthly-summary-chart.component.html',
  styleUrls: ['./monthly-summary-chart.component.less']
})
export class MonthlySummaryChartComponent implements OnInit {

  @Input() data: any;
  currentData: any;
  originalData: any;
  date: Date = new Date();


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
      data: [{
        name: 'Microsoft Internet Explorer',
        y: 56.33,
        drilldown: 'Microsoft Internet Explorer'
      }, {
        name: 'Chrome',
        y: 24.03,
        drilldown: 'Chrome'
      }, {
        name: 'Firefox',
        y: 10.38,
        drilldown: 'Firefox'
      }, {
        name: 'Safari',
        y: 4.77,
        drilldown: 'Safari'
      }, {
        name: 'Opera',
        y: 0.91,
        drilldown: 'Opera'
      }, {
        name: 'Proprietary or Undetectable',
        y: 0.2,
        drilldown: null
      }]
    }],
    drilldown: {
      series: [
        {
          name: 'Microsoft Internet Explorer',
          id: 'Microsoft Internet Explorer',
          data: [
            [
              'v11.0',
              24.13
            ],
            [
              'v8.0',
              17.2
            ],
            [
              'v9.0',
              8.11
            ],
            [
              'v10.0',
              5.33
            ],
            [
              'v6.0',
              1.06
            ],
            [
              'v6.1',
              1.05
            ],
            [
              'v6.2',
              1.04
            ],
            [
              'v6.3',
              1.03
            ],
            [
              'v6.4',
              1.02
            ],
            [
              'v6.5',
              1.01
            ],

            [
              'v6.6',
              1.00
            ],
            [
              'v6.7',
              0.99
            ],
            [
              'v6.8',
              0.98
            ],
            [
              'v6.8.1',
              0.98
            ],
            [
              'v6.8.2',
              0.98
            ],
            [
              'v6.8.3',
              0.98
            ],
            [
              'v6.8.4',
              0.98
            ],
            [
              'v6.8.5',
              0.98
            ],
            [
              'v6.8.6',
              0.98
            ],
            [
              'v7.0',
              0.5
            ]
          ]
        }, {
          name: 'Chrome',
          id: 'Chrome',
          data: [
            [
              'v40.0',
              5
            ],
            [
              'v41.0',
              4.32
            ],
            [
              'v42.0',
              3.68
            ],
            [
              'v39.0',
              2.96
            ],
            [
              'v36.0',
              2.53
            ],
            [
              'v43.0',
              1.45
            ],
            [
              'v31.0',
              1.24
            ],
            [
              'v35.0',
              0.85
            ],
            [
              'v38.0',
              0.6
            ],
            [
              'v32.0',
              0.55
            ],
            [
              'v37.0',
              0.38
            ],
            [
              'v33.0',
              0.19
            ],
            [
              'v34.0',
              0.14
            ],
            [
              'v30.0',
              0.14
            ]
          ]
        }, {
          name: 'Firefox',
          id: 'Firefox',
          data: [
            [
              'v35',
              2.76
            ],
            [
              'v36',
              2.32
            ],
            [
              'v37',
              2.31
            ],
            [
              'v34',
              1.27
            ],
            [
              'v38',
              1.02
            ],
            [
              'v31',
              0.33
            ],
            [
              'v33',
              0.22
            ],
            [
              'v32',
              0.15
            ]
          ]
        }, {
          name: 'Safari',
          id: 'Safari',
          data: [
            [
              'v8.0',
              2.56
            ],
            [
              'v7.1',
              0.77
            ],
            [
              'v5.1',
              0.42
            ],
            [
              'v5.0',
              0.3
            ],
            [
              'v6.1',
              0.29
            ],
            [
              'v7.0',
              0.26
            ],
            [
              'v6.2',
              0.17
            ]
          ]
        }, {
          name: 'Opera',
          id: 'Opera',
          data: [
            [
              'v12.x',
              0.34
            ],
            [
              'v28',
              0.24
            ],
            [
              'v27',
              0.17
            ],
            [
              'v29',
              0.16
            ]
          ]
        }]
    }
  };


  constructor(private router: Router) {
  }

  ngOnInit() {
    this.originalData = [...this.data];
    this.currentData = this.data;
  }

  ngOnChanges(changes: any) {
    if (!changes.data.firstChange) {
      if (this.chart) {
        this.originalData = [...this.data];
        this.currentData = this.data;
        this.setDataForMonthRange();
      }
    }
  }

  saveInstance(chartInstance: any) {
    this.chart = chartInstance;
    this.setDataForMonthRange();
    //this.chart.series[0].setData(this.data);
    //this.chart.options.drilldown.series[0] = newDrillDowns;

    console.log(this.chart);
  }

  isDataEmpty(): boolean {
    return this.data.length === 0;
  }

  chartClicked(e: any): void {
    console.log(e);
  }

  chartHovered(e: any): void {
    console.log(e);
  }

  checkDate(e: any) {
    console.log(e);
    console.log(this.date);

    this.setDataForMonthRange();

  }

  setDataForMonthRange() {
    let monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    let monthRange = this.getDateRange();

    let monthSummary = [];
    let drillDown = [];
    for (let month of monthRange) {
      let monthSum = 0;
      let drillDownData = [];

      for (let expense of this.currentData) {

        let currentDate = new Date(expense.date);
        if (month.getMonth() === currentDate.getMonth() && month.getFullYear() === currentDate.getFullYear()) {
          monthSum += expense.amount;
          drillDownData.push(expense);
        }
      }
      let parsedSum;
      if (monthSum !== 0) {
        parsedSum = monthSum.toFixed(2);
      }
      monthSummary.push({
        name: monthNames[month.getMonth()],
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

    let summaryData = [];
    const categories = data.map(item => item.category)
      .filter((value, index, self) => self.indexOf(value) === index);


    for (let category of categories) {
      let categorySum = 0;
      for (let expense of data) {
        if (category === expense.category) {
          categorySum += expense.amount;
        }
      }
      summaryData.push([category, categorySum]);
    }
    return summaryData;
  }

  getDateRange() {

    let monthRange = [this.date];
    for (let i = 1; i < 6; i++) {
      let month = new Date(this.date.getTime());
      month.setMonth(this.date.getMonth() + i);
      monthRange.push(month);
    }
    return monthRange;

  }


}
