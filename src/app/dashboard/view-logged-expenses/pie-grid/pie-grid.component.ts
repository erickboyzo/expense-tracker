import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pie-grid',
  templateUrl: './pie-grid.component.html',
  styleUrls: ['./pie-grid.component.scss']
})
export class PieGridComponent implements OnInit {
  @Input() data: any[] = [
    {
      'name': 'Costa Rica',
      'series': [
        {
          'value': 3805,
          'name': '2016-09-19T16:44:23.443Z'
        },
        {
          'value': 4311,
          'name': '2016-09-17T16:43:12.069Z'
        },
        {
          'value': 5055,
          'name': '2016-09-22T04:59:20.425Z'
        },
        {
          'value': 2882,
          'name': '2016-09-19T16:29:26.126Z'
        },
        {
          'value': 5887,
          'name': '2016-09-23T17:28:22.070Z'
        }
      ]
    },
    {
      'name': 'Finland',
      'series': [
        {
          'value': 3777,
          'name': '2016-09-19T16:44:23.443Z'
        },
        {
          'value': 6687,
          'name': '2016-09-17T16:43:12.069Z'
        },
        {
          'value': 3114,
          'name': '2016-09-22T04:59:20.425Z'
        },
        {
          'value': 5456,
          'name': '2016-09-19T16:29:26.126Z'
        },
        {
          'value': 3719,
          'name': '2016-09-23T17:28:22.070Z'
        }
      ]
    },
    {
      'name': 'Isle of Man',
      'series': [
        {
          'value': 5896,
          'name': '2016-09-19T16:44:23.443Z'
        },
        {
          'value': 2441,
          'name': '2016-09-17T16:43:12.069Z'
        },
        {
          'value': 3695,
          'name': '2016-09-22T04:59:20.425Z'
        },
        {
          'value': 5228,
          'name': '2016-09-19T16:29:26.126Z'
        },
        {
          'value': 2696,
          'name': '2016-09-23T17:28:22.070Z'
        }
      ]
    },
    {
      'name': 'Congo',
      'series': [
        {
          'value': 4986,
          'name': '2016-09-19T16:44:23.443Z'
        },
        {
          'value': 4634,
          'name': '2016-09-17T16:43:12.069Z'
        },
        {
          'value': 5884,
          'name': '2016-09-22T04:59:20.425Z'
        },
        {
          'value': 5614,
          'name': '2016-09-19T16:29:26.126Z'
        },
        {
          'value': 5380,
          'name': '2016-09-23T17:28:22.070Z'
        }
      ]
    },
    {
      'name': 'Cuba',
      'series': [
        {
          'value': 5664,
          'name': '2016-09-19T16:44:23.443Z'
        },
        {
          'value': 3147,
          'name': '2016-09-17T16:43:12.069Z'
        },
        {
          'value': 4681,
          'name': '2016-09-22T04:59:20.425Z'
        },
        {
          'value': 2802,
          'name': '2016-09-19T16:29:26.126Z'
        },
        {
          'value': 3838,
          'name': '2016-09-23T17:28:22.070Z'
        }
      ]
    }
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
