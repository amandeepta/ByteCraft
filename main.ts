import Parser from "./src/parser";
import { inspect } from "util";

 
const sourceCode = "2+3*7";

const parser = new Parser();
const ast = parser.produceAst(sourceCode);

// Print the AST in a readable format
console.log(inspect(ast, { depth: null, colors: true }));
