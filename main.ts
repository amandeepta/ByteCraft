import Parser from "./src/parser";
import { inspect } from "util";

// Example source code (Lisp-style)
const sourceCode = "3+5";

const parser = new Parser();
const ast = parser.produceAst(sourceCode);

// Print the AST in a readable format
console.log(inspect(ast, { depth: null, colors: true }));
