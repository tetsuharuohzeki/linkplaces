export type LooselyPartial<T> = {
    [P in keyof T]?: T[P] | undefined;
};
