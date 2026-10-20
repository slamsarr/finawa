import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AuthState } from './auth.state'

export const selectAuthState =
  createFeatureSelector<AuthState>("authentication");

export const selectUser =
  createSelector(
    selectAuthState,
    (state: AuthState) => state.user
  );

export const selectAccessToken =
  createSelector(
    selectAuthState,
    (state: AuthState) => state.accessToken
  );

export const selectIsAuthenticated = createSelector(
  selectAccessToken,
  token => !!token
);

export const selectLoading =
  createSelector(
    selectAuthState,
    state => state.loading
  );

export const selectError =
  createSelector(
    selectAuthState,
    state => state.error
  );


export const selectProfile =
  createSelector(
    selectUser,
    user => user?.profile
  );
