import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';


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
        text: 'Click on category to hide/show'
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
          enabled: false
        },
        showInLegend: true
      }
    },
    series: [
      {
        name: 'Category',
        colorByPoint: true,
        data: this.data
      }]
  };


  constructor(private router: Router) {
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

  saveInstance(chartInstance: any) {
    this.chart = chartInstance;
    this.chart.series[0].setData(this.data);
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

}
