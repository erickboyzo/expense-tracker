import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterLink } from '@angular/router';
import { cloneDeep, includes } from 'lodash';
import { UserDataRecord } from '../core/interfaces/user-data-record';
import { DatabaseService } from '../core/services/database.service';
import { ExpenseDataService } from '../core/services/expense-data.service';
import { UserService } from '../core/services/user.service';
import { defaultExpenseCategories, defaultExpenseTypes } from '../shared/constants/expense-constants';
import { ManageOptionsComponent } from './components/manage-options/manage-options.component';
import { ChipOption } from './interfaces/chip-option';

@Component({
  selector: 'app-expense-settings',
  imports: [
    MatCardModule,
    MatStepperModule,
    MatIcon,
    RouterLink,
    MatChipsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ManageOptionsComponent,
  ],
  templateUrl: './expense-settings.component.html',
  styleUrl: './expense-settings.component.scss',
})
export class ExpenseSettingsComponent implements OnInit {
  readonly expenseDataService: ExpenseDataService = inject(ExpenseDataService);
  readonly categoriesSignal = signal<ChipOption[]>([]);
  readonly copyCategoriesSignal = signal<ChipOption[]>([]);

  readonly sourceTypeSignal = signal<ChipOption[]>([]);
  readonly sourceTypeSignalOriginal = signal<ChipOption[]>([]);

  isLoadingUserInformation = signal(false);
  isLoadingUserCategories = signal(false);
  isUpdatingCategories = signal(false);
  isUpdatingSourceTypes = signal(false);

  constructor(
    private userService: UserService,
    private database: DatabaseService,
    private snackBar: MatSnackBar,
  ) {
    userService.userIdSetAnnounced$.subscribe(() => {
      this.getAllUserDetails();
    });
  }

  ngOnInit() {
    this.getAllUserDetails();
  }

  saveCategories() {
    this.isUpdatingCategories.set(true);
    const currentUser = this.userService.getUserId();
    this.database
      .saveNewCategories(
        this.categoriesSignal().map((category) => category.value),
        currentUser,
      )
      .then(() => {
        this.expenseDataService.setCategoriesSignal(this.categoriesSignal().map((category) => category.value));
        this.copyCategoriesSignal.set(cloneDeep(this.categoriesSignal()));
        this.openSnackBar('Categories saved!');
        this.onUpdateToCategories();
        this.isUpdatingCategories.set(false);
      })
      .catch((e) => {
        this.openSnackBar(e.message);
        this.isUpdatingCategories.set(false);
      });
  }

  saveTypes() {
    this.isUpdatingSourceTypes.set(true);
    const currentUser = this.userService.getUserId();
    this.database
      .saveNewExpenseSourceTypes(
        this.sourceTypeSignal().map((category) => category.value),
        currentUser,
      )
      .then(() => {
        this.sourceTypeSignalOriginal.set(cloneDeep(this.sourceTypeSignal()));
        this.expenseDataService.setExpenseSourcesData([...this.sourceTypeSignal().map((category) => category.value)]);
        this.openSnackBar('Expense Source Types saved!');
        this.isUpdatingSourceTypes.set(false);
      })
      .catch((e) => {
        this.openSnackBar(e.message);
        this.isUpdatingSourceTypes.set(false);
      });
  }

  private getAllUserDetails() {
    if (this.userService.getUser()) {
      this.isLoadingUserInformation.set(true);
      this.isLoadingUserCategories.set(true);
      this.database
        .getUserDetails(this.userService.getUser()?.email ?? '')
        .then((jsonData) => {
          const obj: Record<string, UserDataRecord> = (jsonData.toJSON() ?? {}) as Record<string, UserDataRecord>;
          const key = Object.keys(obj)[0] as string;
          this.userService.setUserId(key);
          const categories = obj[key]['categories'] ?? {};
          const sourceTypes = obj[key]['types'] ?? {};
          const categoriesList = Object.keys(categories).map((key) => categories[key]);
          const sourceTypesList = Object.keys(sourceTypes).map((key) => sourceTypes[key]);
          this.setCategoriesOptions(categoriesList.length ? categoriesList : [...defaultExpenseCategories]);
          this.setSourceTypeOptions(sourceTypesList.length ? sourceTypesList : [...defaultExpenseTypes]);
          this.isLoadingUserInformation.set(false);
        })
        .catch((e) => {
          this.isLoadingUserInformation.set(false);
          this.openSnackBar(`Error! ${e.message}.`);
        });
    }
  }

  private setCategoriesOptions(categoriesArr: string[]) {
    const categories = categoriesArr.map((category) => ({
      value: category,
      removable: !includes(defaultExpenseCategories, category),
    }));
    this.categoriesSignal.set([...categories]);
    this.copyCategoriesSignal.set([...categories]);
    this.expenseDataService.setCategoriesSignal(categoriesArr);
    this.onUpdateToCategories();
  }

  private setSourceTypeOptions(sourceTypes: string[]) {
    const expenseSourceTypes = sourceTypes.map((type) => ({
      value: type,
      removable: !includes(defaultExpenseTypes, type),
    }));
    this.sourceTypeSignal.set([...expenseSourceTypes]);
    this.sourceTypeSignalOriginal.set([...expenseSourceTypes]);
  }

  private onUpdateToCategories() {
    this.database.announceCategoriesAdded('Categories Added');
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }
}
