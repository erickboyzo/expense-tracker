import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, RouterModule } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { LoginService } from './core/services/login.service';

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
    private loginService: LoginService,
  ) {
    this.afAuth.authState.pipe(takeUntilDestroyed()).subscribe((authData) => {
      console.log(authData);

      if (authData && authData.email) {
        this.loginService.setUserId(authData.uid);
        console.log(authData.uid);
        this.loginService.setUser(authData);
        console.log(authData);
        this.loginService.announceUserIdCreated('user created!');
        this.router.navigate(['/dashboard']).then();
      } else {
        this.router.navigate(['/login']).then();
      }
    });
  }
}
