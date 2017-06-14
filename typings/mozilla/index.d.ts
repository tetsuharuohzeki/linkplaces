declare module 'chrome' {
    export const Cc: {
        [id: string]: {
            getService(): any;
        };
    };

    export const Cu: any;

    export const Ci: any;
}


declare module 'redux/es/createStore' {
    export const ActionTypes: {
        readonly INIT: any;
    };
}
