import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  viewChild,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStep, MatStepLabel, MatStepper } from '@angular/material/stepper';
import { Expense } from '@core/interfaces/expense-model';
import { DatabaseService } from '@core/services/database.service';
import { ExpenseDataService } from '@core/services/expense-data.service';
import { UserService } from '@core/services/user.service';
import { CardSpinnerComponent } from '@shared/components/card-spinner/card-spinner.component';
import { Papa, ParseResult } from 'ngx-papaparse';
import { catchError, forkJoin, timeout, TimeoutError } from 'rxjs';
import { CsvRow, ReviewedExpenses } from '../../interfaces/import-interfaces';
import { FileImportMapperComponent } from '../file-import-mapper/file-import-mapper.component';
import { FileImportReviewComponent } from '../file-import-review/file-import-review.component';

@Component({
  selector: 'app-file-import-steps',
  imports: [
    CardSpinnerComponent,
    FileImportReviewComponent,
    MatButton,
    MatCardModule,
    MatStep,
    FileImportMapperComponent,
    MatStepper,
    MatStepLabel,
    MatDivider,
    MatIcon,
    MatIconButton,
    MatProgressSpinner,
  ],
  templateUrl: './file-import-steps.component.html',
  styleUrl: './file-import-steps.component.scss',
})
export class FileImportStepsComponent implements OnInit {
  @Input() file!: File;
  @Output() fileRemoved = new EventEmitter<void>();
  @Input() firstFile = false;

  private stepper = viewChild<MatStepper>('stepper');

  csvData: CsvRow[] = [];
  csvHeaders: string[] = [];

  isLoading = false;
  parseError: string | null = null;
  importSummary = signal<string[]>([]);
  isFormValid = signal(false);
  previewData = signal<Expense[]>([]);
  reviewedExpensesToSave = signal<ReviewedExpenses>({
    debits: [],
    credits: [],
  });
  hasReviewedExpenses = computed(() => {
    const { debits, credits } = this.reviewedExpensesToSave();
    return debits.length > 0 || credits.length > 0;
  });
  expensesImported = signal(false);
  importInProgress = signal(false);

  private papa: Papa = inject(Papa);
  private elementRef: ElementRef = inject(ElementRef);
  private expenseDataService = inject(ExpenseDataService);
  private userService = inject(UserService);
  private databaseService = inject(DatabaseService);
  private matSnackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.parseCSVFile();
    if (this.firstFile) {
      this.elementRef.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  saveExpenses() {
    this.importInProgress.set(true);
    const { debits, credits } = this.reviewedExpensesToSave();
    const allExpenses = [...debits, ...credits];
    const userId = this.userService.getUserId();
    const newCategories = new Set();
    const newTypes = new Set();
    const filesImported = [...this.expenseDataService.filesImportedSignal()];
    allExpenses.forEach((expense) => {
      if (!this.expenseDataService.categoriesSignal().includes(expense.category)) {
        newCategories.add(expense.category);
      }
      if (!this.expenseDataService.expenseSourcesSignal().includes(expense.type)) {
        newTypes.add(expense.type);
      }
    });

    const updates = [this.databaseService.batchPushExpensesWithBatch(allExpenses, userId)];
    let categories: string[] = [];
    let types: string[] = [];
    if (newCategories.size > 0) {
      categories = [...this.expenseDataService.categoriesSignal(), ...newCategories] as string[];
      updates.push(this.databaseService.saveNewCategories(categories, userId));
    }

    if (newTypes.size > 0) {
      types = [...this.expenseDataService.expenseSourcesSignal(), ...newTypes] as string[];
      updates.push(this.databaseService.saveNewExpenseSourceTypes(types, userId));
    }

    if (!filesImported.includes(this.file.name)) {
      filesImported.push(this.file.name);
      updates.push(this.databaseService.saveNewImportedFiles(filesImported, userId));
    }

    forkJoin(updates)
      .pipe(
        timeout(30000), // 30 second timeout
        catchError((error) => {
          if (error instanceof TimeoutError) {
            this.matSnackBar.open('Operation timed out', 'OK', { duration: 2000 });
          }
          throw error;
        }),
      )
      .subscribe({
        next: () => {
          const summaryUpdates = [`Expenses imported: ${allExpenses.length}`];
          this.expenseDataService.setFilesImported(filesImported);

          if (categories.length) {
            this.expenseDataService.setCategoriesSignal(categories);
            summaryUpdates.push(`New categories added: ${categories.length}`);
          }

          if (types.length) {
            this.expenseDataService.setExpenseSourcesData(types);
            summaryUpdates.push(`New expense sources added: ${types.length}`);
          }

          if (filesImported.length > this.expenseDataService.filesImportedSignal().length) {
            this.expenseDataService.setFilesImported(filesImported);
          }

          this.importSummary.set(summaryUpdates);
          this.importInProgress.set(false);
          this.expensesImported.set(true);
          setTimeout(() => {
            this.stepper()?.next();
          });
        },
        error: (error) => {
          console.error('Error importing expenses:', error);
          this.importInProgress.set(false);
          this.matSnackBar.open('Error importing expenses', 'OK', { duration: 2000 });
        },
        complete: () => {
          this.importInProgress.set(false);
        },
      });
  }

  private parseCSVFile(): void {
    this.isLoading = true;
    this.parseError = null;

    const options = {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult) => {
        this.isLoading = false;
        this.csvHeaders = results.meta.fields || [];
        this.csvData = results.data;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (error: any) => {
        this.isLoading = false;
        this.parseError = error.message;
      },
    };

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const result = event?.target?.result as string | Blob;
        this.papa.parse(result, options);
      } catch (err) {
        this.isLoading = false;
        this.parseError = 'Error parsing CSV file - ' + err;
      }
    };
    reader.onerror = () => {
      this.isLoading = false;
      this.parseError = 'Error reading file';
    };
    reader.readAsText(this.file);
  }
}
