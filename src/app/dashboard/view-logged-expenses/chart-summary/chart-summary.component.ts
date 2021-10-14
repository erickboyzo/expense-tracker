import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartEvent } from 'angular2-highcharts/dist/ChartEvent';


@Component({
  selector: 'app-chart-summary',
  templateUrl: 'chart-summary.component.html',
  styleUrls: ['chart-summary.component.scss']
})

export class ChartSummaryComponent implements OnInit, OnChanges {
  @Input() data: any;
  chart: any;
  options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: null
    },
    legend: {
      align: 'center',
      padding: 10,
      title: {
        text: null
      }
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}% (${point.y:.2f})</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    series: [
      {
        name: 'Category',
        colorByPoint: true,
        data: this.data
      }]
  };


  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (!changes.data.firstChange) {
      if (this.chart) {
        this.chart.series[0].setData(changes.data.currentValue);
      }
    }
  }

  saveInstance(chartInstance: ChartEvent) {
    this.chart = chartInstance;
    this.chart.series[0].setData(this.data);
  }
}
