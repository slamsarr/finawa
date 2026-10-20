import { Injectable, inject } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ToastService } from '@utils/toast.service'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private toastService = inject(ToastService)

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    if (request.url.includes('/refresh')) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Skip auto-toast for 401 when handling token refresh to avoid duplicate alerts
        if (error.status === 401) {
          return throwError(() => error)
        }

        let errorMessage = 'Une erreur est survenue lors de la communication avec le serveur'

        if (error.error) {
          if (typeof error.error === 'string') {
            errorMessage = error.error
          } else if (error.error.message && typeof error.error.message === 'string') {
            errorMessage = error.error.message
          } else if (error.error.detail && typeof error.error.detail === 'string') {
            errorMessage = error.error.detail
          }
        } else if (error.status === 0) {
          errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion réseau.'
        } else if (error.status === 403) {
          errorMessage = 'Accès non autorisé.'
        } else if (error.status === 404) {
          errorMessage = 'Ressource non trouvée.'
        } else if (error.status >= 500) {
          errorMessage = 'Erreur serveur interne. Veuillez réessayer plus tard.'
        }

        // Display toast message
        this.toastService.showError(errorMessage)

        return throwError(() => error)
      })
    )
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
}
