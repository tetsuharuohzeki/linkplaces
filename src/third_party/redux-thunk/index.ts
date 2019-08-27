// https://raw.githubusercontent.com/reduxjs/redux-thunk/master/index.d.ts

import { Middleware, Dispatch, Action, MiddlewareAPI, AnyAction } from 'redux';

/**
 * The dispatch method as modified by React-Thunk; overloaded so that you can
 * dispatch:
 *   - standard (object) actions: `dispatch()` returns the action itself
 *   - thunk actions: `dispatch()` returns the thunk's return value
 *
 * @template TState The redux state
 * @template TExtraThunkArg The extra argument passed to the inner function of
 * thunks (if specified when setting up the Thunk middleware)
 * @template TBasicAction The (non-thunk) actions that can be dispatched.
 */
export interface ThunkDispatch<
    TState,
    TExtraThunkArg,
    TBasicAction extends Action
    > {
    <TReturnType>(
        thunkAction: ThunkAction<TReturnType, TState, TExtraThunkArg, TBasicAction>
    ): TReturnType;
    <TDerivedAction extends TBasicAction>(action: TDerivedAction): TDerivedAction;
}

/**
 * A "thunk" action (a callback function that can be dispatched to the Redux
 * store.)
 *
 * Also known as the "thunk inner function", when used with the typical pattern
 * of an action creator function that returns a thunk action.
 *
 * @template TReturnType The return type of the thunk's inner function
 * @template TState The redux state
 * @template TExtraThunkARg Optional extra argument passed to the inner function
 * (if specified when setting up the Thunk middleware)
 * @template TBasicAction The (non-thunk) actions that can be dispatched.
 */
export type ThunkAction<
    TReturnType,
    TState,
    TExtraThunkArg,
    TBasicAction extends Action
    > = (
        dispatch: ThunkDispatch<TState, TExtraThunkArg, TBasicAction>,
        getState: () => TState,
        extraArgument: TExtraThunkArg
    ) => TReturnType;

/**
 * A generic type that takes a thunk action creator and returns a function
 * signature which matches how it would appear after being processed using
 * bindActionCreators(): a function that takes the arguments of the outer
 * function, and returns the return type of the inner "thunk" function.
 *
 * @template TActionCreator Thunk action creator to be wrapped
 */
export type ThunkActionDispatch<
    // eslint-disable-next-line
    TActionCreator extends (...args: any[]) => ThunkAction<any, any, any, any>
    > = (
        ...args: Parameters<TActionCreator>
    ) => ReturnType<ReturnType<TActionCreator>>;

/**
 * @template TState The redux state
 * @template TBasicAction The (non-thunk) actions that can be dispatched
 * @template TExtraThunkArg An optional extra argument to pass to a thunk's
 * inner function. (Only used if you call `thunk.withExtraArgument()`)
 */
export type ThunkMiddleware<
    TState = {},
    TBasicAction extends Action = AnyAction,
    TExtraThunkARg = undefined
    > = Middleware<
        ThunkDispatch<TState, TExtraThunkARg, TBasicAction>,
        TState,
        ThunkDispatch<TState, TExtraThunkARg, TBasicAction>
    >;

export function createThunkMiddleware<TAction extends Action, TState, TArgument, TReturnType>(extraArgument: TArgument): ThunkMiddleware<TState, AnyAction, TArgument> {
    return function createCreateDispatchAction({ dispatch, getState }: MiddlewareAPI<Dispatch<AnyAction>, TState>) {
        return function createDispatchAction(next: Dispatch<TAction>) {
            return function dispatchAction(action: TAction | ThunkAction<TReturnType, TState, TArgument, TAction>): (TAction | TReturnType) {
                if (typeof action === 'function') {
                    return action(dispatch, getState, extraArgument);
                }

                return next(action);
            };
        };
    };
}
