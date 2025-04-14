import { Component, inject, Input, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { Papa } from 'ngx-papaparse';
import { Subscription } from 'rxjs';
import { Expense } from '../../../core/interfaces/expense-model';
import { CsvRow, FormMapping } from '../../interfaces/import-interfaces';

interface NegativeAmountOption {
  label: string;
  value: 'omit' | 'credit' | 'debit';
}

@Component({
  selector: 'app-file-import-mapper',
  imports: [
    MatCardModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelect,
    MatOption,
    MatRadioGroup,
    MatRadioButton,
  ],
  templateUrl: './file-import-mapper.component.html',
  styleUrl: './file-import-mapper.component.scss',
})
export class FileImportMapperComponent implements OnInit {
  @Input() file!: File;
  @Input() csvData: CsvRow[] = [];
  @Input() csvHeaders: string[] = [];
  @Input() previewData = signal<Expense[]>([]);
  @Input() isFormValid = signal(false);

  // Define the expense properties that can be mapped
  expenseProperties: { key: keyof Expense; label: string; required: boolean }[] = [
    { key: 'name', label: 'Expense Name', required: true },
    { key: 'amount', label: 'Amount', required: true },
    { key: 'date', label: 'Date', required: true },
    { key: 'category', label: 'Category', required: false },
    { key: 'type', label: 'Payment Type', required: false },
    { key: 'comments', label: 'Comments', required: false },
  ];
  negativeAmountOptions: NegativeAmountOption[] = [
    { label: 'Omit Negative Amounts', value: 'omit' },
    { label: 'Treat Negative Amounts as Credits', value: 'credit' },
    { label: 'Treat Negative Amounts as Debits', value: 'debit' },
  ];

  mappingForm!: FormGroup;

  private papa: Papa = inject(Papa);
  private formBuilder = inject(FormBuilder);
  private $subscriptions = new Subscription();

  ngOnInit(): void {
    this.initMappingForm();
  }

  private initMappingForm(): void {
    const formGroup: Record<string, unknown> = {};

    this.expenseProperties.forEach((prop) => {
      formGroup[prop.key] = ['', prop.required ? Validators.required : null];
    });

    formGroup['handleNegativeAmounts'] = ['', Validators.required];

    this.mappingForm = this.formBuilder.group(formGroup, {
      validators: this.uniqueColumnMappingValidator(),
    });

    this.$subscriptions.add(
      this.mappingForm.statusChanges.subscribe((value) => {
        this.isFormValid.set(value === 'VALID');
        if (value === 'VALID') {
          this.previewMappedData();
        }
      }),
    );
  }

  private uniqueColumnMappingValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const form = formGroup as FormGroup;
      const selectedValues = Object.entries(form.value)
        .filter(([key]) => key !== 'handleNegativeAmounts') // Exclude non-mapping fields
        .map(([, value]) => value)
        .filter((value) => value !== ''); // Ignore empty selections

      const duplicates = selectedValues.filter((value, index) => selectedValues.indexOf(value) !== index);

      if (duplicates.length > 0) {
        const duplicateControls = Object.entries(form.controls).filter(
          ([key, control]) => key !== 'handleNegativeAmounts' && duplicates.includes(control.value),
        );

        // Set errors on each control with a duplicate value
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        duplicateControls.forEach(([key, control]) => {
          control.setErrors({
            ...control.errors,
            duplicateMapping: {
              duplicate: control.value,
              message: `Column "${control.value}" is already mapped`,
            },
          });
        });

        return { duplicateMapping: true };
      }

      // Clear duplicate errors if they exist
      Object.entries(form.controls)
        .filter(([key]) => key !== 'handleNegativeAmounts')
        .forEach(([, control]) => {
          if (control.errors?.['duplicateMapping']) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { duplicateMapping, ...remainingErrors } = control.errors;
            control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
          }
        });

      return null;
    };
  }

  private generateExpensesFromCSV(): Expense[] {
    if (!this.mappingForm?.valid || !this.csvData?.length) {
      return [];
    }

    const formMapping = this.mappingForm.value;
    const expenses: Expense[] = [];

    for (const row of this.csvData) {
      const expense = this.generateExpenseFromCSV(row, formMapping);
      if (expense) {
        expenses.push(expense as Expense);
      }
    }

    return expenses;
  }

  private previewMappedData(): void {
    this.previewData.set(this.generateExpensesFromCSV());
  }

  private generateExpenseFromCSV(csvRow: CsvRow, formMapping: FormMapping): Partial<Expense> | null {
    const expense: Partial<Expense> = this.createBaseExpense();

    // Map the basic fields from the form mapping
    for (const prop of this.expenseProperties) {
      const mappedColumn = formMapping[prop.key];
      if (mappedColumn) {
        const value = csvRow[mappedColumn] ?? '';
        this.mapPropertyToExpense(expense, prop.key, value, formMapping);
      }
    }

    return this.validateExpense(expense);
  }

  private createBaseExpense(): Partial<Expense> {
    return {
      importedOn: new Date(),
      importedFrom: this.file.name,
      category: 'Unassigned',
      type: 'Debit',
      comments: '',
    };
  }

  private mapPropertyToExpense(
    expense: Partial<Expense>,
    propertyKey: keyof Expense,
    value: string,
    formMapping: FormMapping,
  ): void {
    switch (propertyKey) {
      case 'date':
        expense.date = this.parseDate(value);
        break;
      case 'amount': {
        const processedAmount = this.processAmount(value, formMapping.handleNegativeAmounts);
        if (processedAmount === null) return;
        expense.amount = processedAmount;
        break;
      }
      case 'category':
        expense.category = value ?? 'Unassigned';
        break;
      case 'type':
        expense.type = value ?? 'Debit';
        break;
      case 'comments':
        expense.comments = value ?? '';
        break;
      case 'name':
        expense.name = value ?? 'Unnamed Expense';
        break;
    }
  }

  private parseDate(value: string): Date | string {
    const parsedDate = new Date(value);
    return !isNaN(parsedDate.getTime()) ? parsedDate : value;
  }

  private processAmount(value: string, handleNegativeAmounts: 'omit' | 'credit' | 'debit'): number | null {
    const cleanAmount = value.replace(/[$,]/g, '');
    const numAmount = parseFloat(cleanAmount);

    if (isNaN(numAmount)) return null;

    return this.applyAmountRules(numAmount, handleNegativeAmounts);
  }

  private applyAmountRules(amount: number, handleNegativeAmounts: 'omit' | 'credit' | 'debit'): number | null {
    const isNegative = amount < 0;

    switch (handleNegativeAmounts) {
      case 'omit':
        return null;
      case 'credit':
        return isNegative ? -amount : amount;
      case 'debit':
        return isNegative ? Math.abs(amount) : -amount;
      default:
        return amount;
    }
  }

  private validateExpense(expense: Partial<Expense>): Expense | null {
    const requiredFields = this.expenseProperties.filter((prop) => prop.required).map((prop) => prop.key);

    const hasAllRequired = requiredFields.every(
      (field) => expense[field] !== undefined && expense[field] !== null && expense[field] !== '',
    );

    return hasAllRequired ? (expense as Expense) : null;
  }
}
