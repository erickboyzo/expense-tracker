import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ExpenseSummary } from '../../interfaces/expense-summary';

@Component({
  selector: 'app-number-cards',
  templateUrl: './number-cards.component.html',
  imports: [MatCardContent, MatIcon, NgClass, MatCard, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./number-cards.component.scss'],
})
export class NumberCardsComponent {
  @Input() data?: ExpenseSummary;
}
