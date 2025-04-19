import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, signal, Type } from '@angular/core';
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
import { WindowService } from '@core/services/window.service';
import { defaultExpenseCategories, defaultExpenseTypes } from '@shared/constants/expense-constants';
import { ResponsiveService } from '@shared/services/responsive.service';
import firebase from 'firebase/compat/app';
import { filter, switchMap } from 'rxjs';
import { UserDataRecord } from '../../interfaces/user-data-record';
import { UserDetails } from '../../interfaces/user-details';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { ExpenseDataService } from '../../services/expense-data.service';
import { UserService } from '../../services/user.service';
import { FooterLinksComponent } from '../footer-links/footer-links.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
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
    NgTemplateOutlet,
    RouterLinkActive,
    RouterLink,
    PageHeaderComponent,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    FooterLinksComponent,
    NgIf,
  ],
})
export class LayoutComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  userService: UserService = inject(UserService);
  user = this.userService.currentUser;
  name: UserDetails | undefined;
  breakpointObserver = inject(ResponsiveService);
  isHandset = this.breakpointObserver.isHandset;
  fixedContainer = false;
  isCompactMenuEnabled = signal(false);

  private authService: AuthService = inject(AuthService);
  private databaseService: DatabaseService = inject(DatabaseService);
  private dataService: ExpenseDataService = inject(ExpenseDataService);
  private userEffect = effect(() => {
    if (this.userService.getUser()) {
      this.getAllUserDetails();
    }
  });
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private isFirstRun = true;
  private readonly windowService = inject(WindowService);
  private iconsOnlyEffect = effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isIconsOnly = this.isCompactMenuEnabled();
    if (this.isFirstRun) {
      this.isFirstRun = false;
      return;
    }
    setTimeout(() => {
      this.windowService.dispatchResizeEvent();
    }, 100);
  });

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
    this.authService.signOut().then(() => {
      this.userService.setUser(undefined);
      this.dataService.setExpensesData([]);
      this.dataService.setTimeFrameFilter(undefined);
      this.dataService.setFilesImported([]);
      this.dataService.setCategoriesSignal([...defaultExpenseCategories]);
      this.dataService.setExpenseSourcesData([...defaultExpenseTypes]);
    });
  }

  menuClick(drawer: MatSidenav) {
    if (this.isHandset()) {
      drawer.toggle();
    }
  }

  toggleIconsOnly() {
    this.isCompactMenuEnabled.set(!this.isCompactMenuEnabled());
  }

  openUserDetails() {
    const dialogRef = this.dialog.open(UserDetailsComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUserDetails();
        this.snackBar.open('Profile update saved successfully!', '', { duration: 2000 });
      }
    });
  }

  private getAllUserDetails() {
    this.databaseService
      .getUserDetails(this.userService.getUser()?.email ?? '')
      .then((jsonData: firebase.database.DataSnapshot) => {
        const data = (jsonData.toJSON() ?? {}) as Record<string, UserDataRecord>;
        const userId = Object.keys(data)[0];
        this.userService.setUserId(userId);
        this.userService.setUserDetails({ firstName: data[userId]['firstName'], lastName: data[userId]['lastName'] });
        const categories = data[userId]['categories'] ?? {};
        const sourceTypes = data[userId]['types'] ?? {};
        const importFiles = data[userId]['filesImported'] ?? {};
        const categoriesList = Object.keys(categories).map((key) => categories[key]);
        const sourceTypesList = Object.keys(sourceTypes).map((key) => sourceTypes[key]);
        const filesImported = Object.keys(data[userId]['filesImported'] ?? {}).map((key) => importFiles[key]);
        console.log(filesImported);
        this.dataService.setCategoriesSignal(categoriesList.length ? categoriesList : [...defaultExpenseCategories]);
        this.dataService.setExpenseSourcesData(sourceTypesList.length ? sourceTypesList : [...defaultExpenseTypes]);
        this.dataService.setFilesImported(filesImported ?? []);
      });
  }
}
