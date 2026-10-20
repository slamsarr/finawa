import { ActionReducerMap } from '@ngrx/store'
import { LayoutState, layoutReducer } from './layout/layout-reducers'
import { AuthState } from './authentication/auth.state'
import { authReducer } from './authentication/auth.reducer'

export interface RootReducerState {
  layout: LayoutState
  authentication: AuthState
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
  layout: layoutReducer,
  authentication: authReducer,
}
