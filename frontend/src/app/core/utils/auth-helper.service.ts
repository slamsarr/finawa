import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '@openapi/services';
import { ApiConfiguration } from '@openapi/api-configuration';
import { LoginResponse, LoginRequest, ResponseLoginResponse, ResponseVoid } from '../openapi/models';
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'


@Injectable({
  providedIn: 'root'
})
export class AuthHelperService {
  private authService = inject(AuthenticationService);
  private http = inject(HttpClient);
  private config = inject(ApiConfiguration);


  login(login: LoginRequest): Observable<LoginResponse> {
    return this.authService.signIn({ body: login })
      .pipe(
        map((response: ResponseLoginResponse) => {
          return response.payload!;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      )
  }

  refresh(): Observable<LoginResponse> {
    return this.authService.refresh({})
      .pipe(
        map((response: ResponseLoginResponse) => {
          return response.payload!;
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(err);
        })
      )
  }

  logout(): Observable<string> {
    return this.authService.logout()
      .pipe(
        map((res: ResponseVoid) => {
          return res.message!;
        })
      )
  }

  verifyEmail(token: string): Observable<string> {
    return this.http.post<ResponseVoid>(`${this.config.rootUrl}/auth/verify-email`, { token })
      .pipe(
        map((res) => res.message || 'Votre compte a été validé avec succès.'),
        catchError((err: HttpErrorResponse) => throwError(() => err))
      );
  }

  resendVerification(email: string): Observable<string> {
    return this.http.post<ResponseVoid>(`${this.config.rootUrl}/auth/resend-verification`, { email })
      .pipe(
        map((res) => res.message || 'Un nouvel email de confirmation a été envoyé.'),
        catchError((err: HttpErrorResponse) => throwError(() => err))
      );
  }

  forgotPassword(email: string): Observable<string> {
    return this.http.post<ResponseVoid>(`${this.config.rootUrl}/auth/forgot-password`, { email })
      .pipe(
        map((res) => res.message || 'Email de réinitialisation envoyé.'),
        catchError((err: HttpErrorResponse) => throwError(() => err))
      );
  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    return this.http.post<ResponseVoid>(`${this.config.rootUrl}/auth/reset-password`, { token, newPassword })
      .pipe(
        map((res) => res.message || 'Mot de passe réinitialisé avec succès.'),
        catchError((err: HttpErrorResponse) => throwError(() => err))
      );
  }
}
