import { NgIf } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, signal, Signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { cloneDeep, find, findIndex, isEqual } from 'lodash';
import { CardSpinnerComponent } from '../../../shared/components/card-spinner/card-spinner.component';
import { ChipOption } from '../../interfaces/chip-option';

@Component({
  selector: 'app-manage-options',
  imports: [
    MatCardModule,
    CardSpinnerComponent,
    MatChipsModule,
    MatFormField,
    MatButtonModule,
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIcon,
  ],
  templateUrl: './manage-options.component.html',
  styleUrl: './manage-options.component.scss',
})
export class ManageOptionsComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() label = '';
  @Input() placeHolder = '';

  @Input() isLoadingData: Signal<boolean> = signal<boolean>(true);
  @Input() isUpdatingData: Signal<boolean> = signal<boolean>(true);
  @Input() options: WritableSignal<ChipOption[]> = signal([]);
  @Input() originalOptions: WritableSignal<ChipOption[]> = signal([]);

  @Output() saveOptionsEvent = new EventEmitter<void>();

  optionsUpdated: Signal<boolean> = computed(() => !isEqual(this.options(), this.originalOptions()));

  onOptionRemove(keyword: ChipOption) {
    this.options.update((keywords: ChipOption[]) => {
      const matchingIndex = findIndex(keywords, (category) => category.value === keyword.value);
      if (matchingIndex < 0) {
        return keywords;
      }

      keywords.splice(matchingIndex, 1);
      return [...keywords];
    });
  }

  onOptionEntered(data: MatChipInputEvent) {
    const valueTrimmed = data.value.trim();
    if (!valueTrimmed) {
      return;
    }
    const matchingCategory = find(
      this.options(),
      (c) => c.value.trim() === valueTrimmed || c.value.trim().toLowerCase() === valueTrimmed.toLowerCase(),
    );
    if (!matchingCategory) {
      this.options.update((categories: ChipOption[]) => {
        return [...categories, { value: data.value, removable: true }];
      });
      data.input.value = '';
    }
  }

  resetOptions() {
    this.options.set(cloneDeep(this.originalOptions()));
  }

  saveOptions() {
    this.saveOptionsEvent.emit();
  }
}
