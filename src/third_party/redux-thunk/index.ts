// https://github.com/gaearon/redux-thunk/issues/169#issuecomment-386073445

import { Middleware, Dispatch, Action, MiddlewareAPI, AnyAction } from 'redux';

export type ThunkAction<TAction extends Action, TState, TArgument, TResult> = (dispatch: Dispatch<TAction>, getState: () => TState, extraArgument: TArgument) => TResult;

export interface ThunkExt<TAction extends Action, TState> {
    dispatch: <TArgument, TResult>(asyncAction: ThunkAction<TAction, TState, TArgument, TResult>) => TResult;
}

export function createThunkMiddleware<TAction extends Action, TState, TArgument, TResult>(extraArgument: TArgument): Middleware<ThunkAction<TAction, TState, TArgument, TResult>, TState> {
    return function createCreateDispatchAction({ dispatch, getState }: MiddlewareAPI<Dispatch<AnyAction>, TState>) {
        return function createDispatchAction(next: Dispatch<TAction>) {
            return function dispatchAction(action: TAction | ThunkAction<TAction, TState, TArgument, TResult>): (TAction | TResult) {
                if (typeof action === 'function') {
                    return action(dispatch, getState, extraArgument);
                }

                return next(action);
            };
        };
    };
}
