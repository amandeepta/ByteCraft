export type Node = "Program" | "NumericLiteral" | "Identifier" | "BinaryExp" | "NullLiteral";

export interface State {
  kind: Node;
}

export interface Program extends State {
  kind: "Program";
  body: State[];
}

export interface Exp extends State {}

export interface BinaryExp extends Exp {
  kind: "BinaryExp";
  left: Exp;
  right: Exp;
  op: string;
}

export interface Identifier extends Exp {
  kind: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Exp {
  kind: "NumericLiteral";
  value: number;
}

export interface NullLiteral extends Exp {
  kind: "NullLiteral";
  value: "null";
}
