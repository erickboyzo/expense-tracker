import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isHandset: Signal<boolean> = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  readonly isHandsetPortrait: Signal<boolean> = toSignal(
    this.breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  readonly isHandsetLandscape: Signal<boolean> = toSignal(
    this.breakpointObserver.observe(Breakpoints.HandsetLandscape).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  readonly isTablet: Signal<boolean> = toSignal(
    this.breakpointObserver.observe(Breakpoints.Tablet).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  readonly isDesktop: Signal<boolean> = toSignal(
    this.breakpointObserver.observe(Breakpoints.Web).pipe(map((result) => result.matches)),
    { initialValue: false },
  );
}
