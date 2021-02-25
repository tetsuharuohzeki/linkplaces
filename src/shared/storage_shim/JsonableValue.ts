export interface HandJSONSerializable {
    toJSON(): JsonStringifiableObject;
}

type JsonStringifiableObject = {
    [TKey in string | number]: JsonableValue;
};

type JsonableObject = JsonStringifiableObject | HandJSONSerializable;

export type JsonableValue = number | string | boolean | undefined | JsonableObject | Array<JsonableValue>;
