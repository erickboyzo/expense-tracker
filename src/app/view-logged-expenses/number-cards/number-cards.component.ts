import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-number-cards',
  templateUrl: './number-cards.component.html',
  styleUrls: ['./number-cards.component.less']
})
export class NumberCardsComponent implements OnInit {

  @Input() data: any[];

  constructor() { }

  ngOnInit() {
  }
}
