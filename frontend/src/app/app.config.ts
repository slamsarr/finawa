import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
  LOCALE_ID,
} from '@angular/core'
import {
  provideRouter,
  withInMemoryScrolling,
  type InMemoryScrollingFeature,
  type InMemoryScrollingOptions,
} from '@angular/router'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { rootReducer } from '@stores/index'
import { routes } from './app.routes'
import { DatePipe, DecimalPipe, registerLocaleData } from '@angular/common'
import localeFr from '@angular/common/locales/fr'

import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http'
import { JwtInterceptorProvider } from '@common/interceptors/jwt.interceptor'
import { ErrorInterceptorProvider } from '@common/interceptors/error.interceptor'
import { provideEffects } from '@ngrx/effects'
import { AuthenticationEffects } from '@stores/authentication/auth.effects'
import { provideStore } from '@ngrx/store'
import { ApiConfiguration } from '@core/openapi/api-configuration'
import { environment } from '../environment'

// scroll
const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
}

const inMemoryScrollingFeatures: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig)

registerLocaleData(localeFr)

export const appConfig: ApplicationConfig = {
  providers: [
    JwtInterceptorProvider,
    ErrorInterceptorProvider,
    DatePipe,
    DecimalPipe,
    provideZoneChangeDetection({
      eventCoalescing: false,
      runCoalescing: false,
      ignoreChangesOutsideZone: true,
    }),
    provideRouter(routes, inMemoryScrollingFeatures),
    provideStore(rootReducer),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(AuthenticationEffects),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {
      provide: ApiConfiguration,
      useFactory: () => {
        const config = new ApiConfiguration()
        if (environment.apiRootUrl) {
          config.rootUrl = environment.apiRootUrl
        }
        return config
      },
    },

    { provide: LOCALE_ID, useValue: 'fr' },
  ],
}
