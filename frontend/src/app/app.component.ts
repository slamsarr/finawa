import { Component, inject, ViewChild } from '@angular/core'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouterOutlet,
  Router,
  type Event,
} from '@angular/router'
import { TitleService } from '@core/utils/title.service'
import { ThemeService } from '@core/utils/theme.service'
import { Store } from '@ngrx/store'
import { DemoAuthService } from '@utils/demo-auth.service'
import { refreshSuccess } from '@stores/authentication/auth.actions'
import {
  NgProgressComponent,
  NgProgressModule,
  type NgProgressRef,
} from 'ngx-progressbar'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgProgressModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  startedClass = false
  progressRef!: NgProgressRef
  @ViewChild(NgProgressComponent) progressBar!: NgProgressComponent

  private titleService = inject(TitleService)
  private themeService = inject(ThemeService)
  private router = inject(Router)
  private store = inject(Store)
  private demoAuth = inject(DemoAuthService)

  constructor() {
    const demo = this.demoAuth.load()
    if (demo?.access_token) {
      this.store.dispatch(refreshSuccess(demo))
    }
    this.router.events.subscribe((event: Event) => {
      this.checkRouteChange(event)
    })
  }

  ngOnInit(): void {
    this.titleService.init()
    this.themeService.initTheme()
  }

  // show Loader when route change
  checkRouteChange(routerEvent: Event) {
    if (routerEvent instanceof NavigationStart) {
      this.progressBar.start()
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      setTimeout(() => {
        this.progressBar.complete()
      }, 200)
    }
  }
}
