import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-number-cards',
  templateUrl: './number-cards.component.html',
  styleUrls: ['./number-cards.component.scss']
})
export class NumberCardsComponent implements OnInit {

  @Input() data: {
    color?: string, value: string | number, metricTitle: string, icon?: string
  };

  constructor() {
  }

  ngOnInit() {
  }
}
