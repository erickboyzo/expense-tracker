import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CardSpinnerComponent } from './card-spinner.component';

@NgModule({
  declarations: [CardSpinnerComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [CardSpinnerComponent]
})
export class CardSpinnerModule {
}
