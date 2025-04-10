export type valueType = "null" | "number";

export interface Runtime {
    type: valueType;
}

export interface NullVal extends Runtime {
    type: "null",
    value: "null",
}

export interface NumVal extends Runtime {
    type: "number",
    value: number,
}
