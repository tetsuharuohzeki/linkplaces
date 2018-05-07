// https://github.com/gaearon/redux-thunk/issues/169#issuecomment-386073445

import { Middleware, Dispatch, Action, MiddlewareAPI, AnyAction } from 'redux';

export type ThunkAction<A extends Action, S, E, R> = (dispatch: Dispatch<A>, getState: () => S, extraArgument: E) => R;

export interface ThunkExt<A extends Action, S> {
    dispatch: <E, R>(asyncAction: ThunkAction<A, S, E, R>) => R;
}

export function createThunkMiddleware<TAction extends Action, TState, TArgument, R>(extraArgument: TArgument): Middleware<ThunkAction<TAction, TState, TArgument, R>, TState> {
    return function createCreateDispatchAction({ dispatch, getState }: MiddlewareAPI<Dispatch<AnyAction>, TState>) {
        return function createDispatchAction(next: Dispatch<TAction>) {
            return function dispatchAction(action: TAction | ThunkAction<TAction, TState, TArgument, R>): (TAction | R) {
                if (typeof action === 'function') {
                    return action(dispatch, getState, extraArgument);
                }

                return next(action);
            };
        };
    };
}
