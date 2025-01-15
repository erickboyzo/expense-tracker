import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Type } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import firebase from 'firebase/compat/app';
import { filter, map, Observable, shareReplay, switchMap, take } from 'rxjs';
import { defaultExpenseCategories, defaultExpenseTypes } from '../../shared/constants/expense-constants';
import { UserDetails } from '../../shared/interfaces/user-details';
import { ExpenseDataService } from '../../shared/services/expense-data.service';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { LoginService } from '../services/login.service';
import { UserDetailsComponent } from '../user-details/user-details.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    NgTemplateOutlet,
    RouterLinkActive,
    RouterLink,
    PageHeaderComponent,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
  ],
})
export class LayoutComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  loginService: LoginService = inject(LoginService);
  user = this.loginService.currentUser;
  name: UserDetails | undefined;
  breakpointObserver = inject(BreakpointObserver);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );
  fixedContainer = false;

  private authService: AuthService = inject(AuthService);
  private databaseService: DatabaseService = inject(DatabaseService);
  private dataService: ExpenseDataService = inject(ExpenseDataService);
  private userEffect = effect(() => {
    if (this.loginService.getUser()) {
      this.getAllUserDetails();
    }
  });
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event) => event instanceof NavigationEnd),
        switchMap(() => (this.route.firstChild ? this.route.firstChild.data : this.route.data)),
      )
      .subscribe((data: Record<string, string | Type<unknown>>) => {
        this.fixedContainer = Boolean(data['fixedContainer']);
      });
  }

  logout() {
    this.authService.signOut().then(() => this.loginService.setUser(undefined));
  }

  menuClick(drawer: MatSidenav) {
    this.isHandset$.pipe(take(1)).subscribe((isHandset) => {
      if (isHandset) {
        drawer.toggle();
      }
    });
  }

  openUserDetails() {
    const dialogRef = this.dialog.open(UserDetailsComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUserDetails();
        this.snackBar.open('Profile updates saved successfully!', '', { duration: 2000 });
      }
    });
  }

  private getAllUserDetails() {
    this.databaseService
      .getUserDetails(this.loginService.getUser()?.email ?? '')
      .then((jsonData: firebase.database.DataSnapshot) => {
        const data: Record<string, any> = jsonData.toJSON() ?? {};
        const userId = Object.keys(data)[0];
        this.loginService.setUserId(userId);
        this.loginService.setUserDetails({ firstName: data[userId]['firstName'], lastName: data[userId]['lastName'] });
        const categories = data[userId]['categories'] ?? {};
        const sourceTypes = data[userId]['types'] ?? {};
        const categoriesList = Object.keys(categories).map((key) => categories[key]);
        const sourceTypesList = Object.keys(sourceTypes).map((key) => sourceTypes[key]);
        this.dataService.setCategoriesSignal(categoriesList.length ? categoriesList : [...defaultExpenseCategories]);
        this.dataService.setExpenseSourcesData(sourceTypesList.length ? sourceTypesList : [...defaultExpenseTypes]);
      });
  }
}
