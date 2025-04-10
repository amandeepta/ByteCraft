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
                const expr = this.parseExp();
                this.expect(TokenType.CloseParen, "Expected closing parenthesis");
                return expr;
            }

            default:
                throw new Error(`Unexpected token: ${this.tokens[0].value}`);
        }
    }

    private parseExp(): Exp {
        let left = this.parsePrimary();

        while (
            this.tokens.length > 0 &&
            this.tokens[0].type === TokenType.BinaryOp
        ) {
            const operator = this.tokens.shift()!;
            const right = this.parsePrimary();

            left = {
                kind: "BinaryExp",
                left,
                right,
                op: operator.value
            } as BinaryExp;
        }

        return left;
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
