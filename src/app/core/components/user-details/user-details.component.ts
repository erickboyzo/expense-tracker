import { DatePipe, NgIf, UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { DatabaseService } from '../../services/database.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-details',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    FormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatFormFieldModule,
    NgIf,
    ReactiveFormsModule,
    DatePipe,
    UpperCasePipe,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  readonly userService: UserService = inject(UserService);
  readonly databaseService: DatabaseService = inject(DatabaseService);
  user = this.userService.currentUser();
  fullName = this.userService.fullName();
  abbreviatedDisplay = this.userService.abbreviatedDisplay();
  userNameForm: FormGroup = new FormGroup({
    firstName: new FormControl(this.userService.userDetails()?.firstName, [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl(this.userService.userDetails()?.lastName, [Validators.required, Validators.minLength(1)]),
  });

  readonly dialogRef = inject(MatDialogRef<UserDetailsComponent>);

  updateDetails() {
    if (this.userNameForm.valid) {
      this.databaseService
        .updateUserDetails(this.userService.getUserId(), this.userNameForm.value)
        .then(() => this.dialogRef.close(true));
    }
  }
}
