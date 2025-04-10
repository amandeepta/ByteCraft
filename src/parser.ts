import { State, Program, Exp, BinaryExp, NumericLiteral, Identifier } from "./ast";
import { Tokenize, Token, TokenType } from "./lex";

export default class Parser {
    private tokens: Token[] = [];

    private getEof(): boolean {
        return this.tokens.length === 0 || this.tokens[0].type === TokenType.EOF;
    }

    private get_smt(): State {
        return this.parseExp();
    }

    private expect(type: TokenType, err: string): Token {
        const token = this.tokens.shift();
        if (!token || token.type !== type) {
            throw new Error(err);
        }
        return token;
    }

    private parsePrimary(): Exp {
        const tk = this.tokens[0].type;

        switch (tk) {
            case TokenType.Identifier: {
                const identToken = this.tokens.shift()!;
                return {
                    kind: "Identifier",
                    symbol: identToken.value
                } as Identifier;
            }

            case TokenType.Number: {
                const numToken = this.tokens.shift()!;
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(numToken.value)
                } as NumericLiteral;
            }

            case TokenType.OpenParen: {
                this.tokens.shift();
                const expr = this.addExp();
                this.expect(TokenType.CloseParen, "Expected closing parenthesis");
                return expr;
            }

            default:
                throw new Error(`Unexpected token: ${this.tokens[0].value}`);
        }
    }

    private addExp(): Exp {
        let left = this.mulExp();
        while (
            this.tokens.length > 0 &&
            this.tokens[0].type === TokenType.BinaryOp &&
            (this.tokens[0].value === "+" || this.tokens[0].value === "-")
        ) {
            const op = this.tokens.shift()!.value;
            const right = this.mulExp();
            left = {
                kind: "BinaryExp",
                left,
                right,
                op
            } as BinaryExp;
        }
        return left;
    }

    private mulExp(): Exp {
        let left = this.parsePrimary();
        while (
            this.tokens.length > 0 &&
            this.tokens[0].type === TokenType.BinaryOp &&
            (this.tokens[0].value === "*" || this.tokens[0].value === "/" || this.tokens[0].value === "%")
        ) {
            const op = this.tokens.shift()!.value;
            const right = this.parsePrimary();
            left = {
                kind: "BinaryExp",
                left,
                right,
                op
            } as BinaryExp;
        }
        return left;
    }

    private parseExp(): Exp {
        return this.addExp();
    }

    public produceAst(code: string): Program {
        this.tokens = Tokenize(code);
        const program: Program = {
            kind: "Program",
            body: [],
        };

        while (!this.getEof()) {
            program.body.push(this.get_smt());
        }

        return program;
    }
}
