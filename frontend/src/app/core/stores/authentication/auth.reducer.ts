import { createReducer, on } from '@ngrx/store'
import { initialAuthState } from './auth.state'
import * as AuthActions from './auth.actions';
import { LoginResponse } from '@openapi/models';


export const authReducer = createReducer(

  initialAuthState,

  on(AuthActions.login, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.loginSuccess,
    (state, response: LoginResponse) => ({
      ...state,
      user: response.user!,
      accessToken: response.access_token!,
      loading: false,
      error: null
    })),

  on(AuthActions.loginFailure, (state, { message }) => ({
    ...state,
    loading: false,
    error: message,
  })),

  on(AuthActions.logoutSuccess, () => ({
    ...initialAuthState
  })),

  on(AuthActions.refreshSuccess,
    (state, response: LoginResponse) => ({
      ...state,
      user: response.user ?? state.user,
      accessToken: response.access_token!,
    })),
);
