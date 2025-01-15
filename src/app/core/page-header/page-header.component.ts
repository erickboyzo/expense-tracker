import { Component, DestroyRef, inject, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent implements OnInit {
  pageTitle = '';
  @ViewChild('dynamic', { read: ViewContainerRef }) viewContainerRef!: ViewContainerRef;

  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event) => event instanceof NavigationEnd),
        switchMap(() => (this.route.firstChild ? this.route.firstChild.data : this.route.data)),
      )
      .subscribe((data: Record<string, string | Type<unknown>>) => {
        this.pageTitle = (data['title'] as string) ?? '';
        this.viewContainerRef.clear();
        if (data['pageActions']) {
          this.viewContainerRef.createComponent(data['pageActions'] as Type<unknown>);
        }
      });
  }
}
