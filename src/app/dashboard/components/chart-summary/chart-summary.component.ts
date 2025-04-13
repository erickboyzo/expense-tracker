import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartData } from '../../interfaces/chart-data';

@Component({
  selector: 'app-chart-summary',
  templateUrl: 'chart-summary.component.html',
  imports: [HighchartsChartModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['chart-summary.component.scss'],
})
export class ChartSummaryComponent implements OnInit, OnChanges {
  @Input() data!: ChartData[];
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  chartOptions: Highcharts.Options = {
    chart: {
      plotShadow: false,
      type: 'pie',
      backgroundColor: 'transparent',
    },
    title: {
      text: '',
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 576,
          },
          chartOptions: {
            legend: {
              enabled: true,
            },
            plotOptions: {
              series: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: [
                  {
                    enabled: false,
                    format: '{point.name}',
                  },
                  {
                    enabled: false,
                    format: '{point.percentage:.0f}%',
                  },
                ],
                showInLegend: true,
              },
            },
          },
        },
      ],
    },
    legend: {
      align: 'center',
      padding: 10,
      title: {
        text: '',
      },
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}% (${point.y:.2f})</b>',
    },
    series: [],
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: [
          {
            enabled: true,
            format: '{point.name} - {point.percentage:.0f}%',
          },
          {
            enabled: false,
            format: '{point.percentage:.0f}%',
          },
        ],
        showInLegend: true,
      },
    },
  };

  ngOnInit() {
    if (this.chartOptions.series) {
      this.chartOptions.series[0] = {
        type: 'pie',
        data: this.data,
      };
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      if (this.chartOptions.series) {
        this.chartOptions.series[0] = {
          type: 'pie',
          data: changes['data'].currentValue,
        };
        this.updateFlag = true;
      }
    }
  }
}
