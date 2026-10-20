import { createAction, props } from '@ngrx/store'
import { LoginResponse, LoginRequest } from '@openapi/models';

export const login = createAction(
  '[Auth] Login',
  props<LoginRequest>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<LoginResponse>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ message: string }>()
);

export const refreshSuccess = createAction(
  '[Auth] Refresh Success',
  props<LoginResponse>()
);

export const logout = createAction(
  '[Auth] Logout'
);

export const logoutSuccess = createAction(
  '[Auth] Logout Success'
);
