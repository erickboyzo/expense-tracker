import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, RouterModule } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private userService: UserService,
  ) {
    this.afAuth.authState.pipe(takeUntilDestroyed()).subscribe((authData) => {
      if (authData && authData.email) {
        this.userService.setUserId(authData.uid);
        this.userService.setUser(authData);
        this.router.navigate(['/dashboard']).then();
      } else {
        this.router.navigate(['/login']).then();
      }
    });
  }
}
