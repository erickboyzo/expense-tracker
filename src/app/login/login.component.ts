import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgIf } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { ResponsiveService } from '@shared/services/responsive.service';
import firebase from 'firebase/compat/app';
import { SignUpComponent } from './sign-up/sign-up.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    MatButton,
    MatCardModule,
    FormsModule,
    MatFormField,
    MatLabel,
    NgIf,
    MatInput,
    MatProgressSpinner,
    ReactiveFormsModule,
    MatError,
    MatIcon,
    MatPrefix,
    SignUpComponent,
  ],
  animations: [
    trigger('visibilityChanged', [
      state('true', style({ opacity: 1, transform: 'scale(1.0)' })),
      state('false', style({ opacity: 0, transform: 'scale(0.0)' })),
      transition('1 => 0', animate('300ms')),
      transition('0 => 1', animate('900ms')),
    ]),
  ],
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  isLoading = false;
  needsToRegister: WritableSignal<boolean> = signal(false);
  breakpointObserver = inject(ResponsiveService);
  isHandset = this.breakpointObserver.isHandset;

  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private userService: UserService = inject(UserService);

  login() {
    if (this.loginForm.invalid) return;
    this.startLoading();
    const { email, password } = this.loginForm.value;
    this.authService
      .logIn(email, password)
      .then((data) => {
        this.userService.setUser(data.user as firebase.User);
        this.stopLoading();
        this.snackBar.open('Login Successful!', '', { duration: 2000 });
        this.onSuccessfulLogin();
      })
      .catch((e) => {
        this.stopLoading();
        console.warn('Catches object set:' + e.message);
        this.snackBar.open(e.message, 'ok', { duration: 4000 });
      });
  }

  toggle() {
    this.needsToRegister.set(!this.needsToRegister());
    this.loginForm.reset();
  }

  private onSuccessfulLogin() {
    this.router.navigate(['/dashboard']).then();
  }

  private startLoading() {
    this.isLoading = true;
  }

  private stopLoading() {
    this.isLoading = false;
  }
}
