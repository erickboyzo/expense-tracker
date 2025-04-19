import { Injectable, inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WINDOW } from '@core/tokens/window.token';

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  private readonly window = inject(WINDOW);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  dispatchResizeEvent(): void {
    if (this.isBrowser) {
      // Run outside NgZone to avoid triggering unnecessary change detection
      this.ngZone.runOutsideAngular(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }
  }

  getViewportSize(): { width: number; height: number } {
    if (!this.isBrowser) {
      return { width: 0, height: 0 };
    }

    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  scrollTo(options: ScrollToOptions): void {
    if (this.isBrowser) {
      this.ngZone.runOutsideAngular(() => {
        window.scrollTo(options);
      });
    }
  }
}
