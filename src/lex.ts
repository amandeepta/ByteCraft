export enum TokenType {
  Number,
  Identifier,
  Equals,
  OpenParen,
  CloseParen,
  BinaryOp,
  EOF
}

export interface Token {
  value: string;
  type: TokenType;
}

function getToken(value: string = "", type: TokenType): Token {
  return { value, type };
}

export function Tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  const src = code.split("");

  while (src.length > 0) {
    const char = src[0];

    if (char === "(") {
      tokens.push(getToken(src.shift()!, TokenType.OpenParen));
    } else if (char === ")") {
      tokens.push(getToken(src.shift()!, TokenType.CloseParen));
    } else if ("+-*/".includes(char)) {
      tokens.push(getToken(src.shift()!, TokenType.BinaryOp));
    } else if (char === "=") {
      tokens.push(getToken(src.shift()!, TokenType.Equals));
    } else if (/\d/.test(char)) {
      let num = "";
      while (src.length > 0 && /\d/.test(src[0])) {
        num += src.shift();
      }
      tokens.push(getToken(num, TokenType.Number));
    } else if (/[a-zA-Z]/.test(char)) {
      let ident = "";
      while (src.length > 0 && /[a-zA-Z]/.test(src[0])) {
        ident += src.shift();
      }
      tokens.push(getToken(ident, TokenType.Identifier));
    } else {
      console.log("unrecognizable content:", char);
      src.shift();
    }
  }
  tokens.push({type : TokenType.EOF, value : "EndOfFile"});
  return tokens;
}

const input ="x+y= 24"

const tokens = Tokenize(input);
for (const token of tokens) {
  console.log(token);
}
