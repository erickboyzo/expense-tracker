import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-card-spinner',
  templateUrl: './card-spinner.component.html',
  imports: [MatProgressSpinner],
  styleUrls: ['./card-spinner.component.scss'],
})
export class CardSpinnerComponent {}
