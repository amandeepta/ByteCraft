import { valueType, Runtime, NullVal, NumVal } from "./value";
import { State, Node, NumericLiteral, BinaryExp, Program } from "./ast";

function evaluateBinExp(binop: BinaryExp): Runtime{
    const lhs = evaluate(binop.left);
    const rhs = evaluate(binop.right);

    if (lhs.type == "number" && rhs.type == "number"){
        return evaluateNumericBinExp(lhs as NumVal, rhs as NumVal, binop.op);
    }

    return {type:"null", value:"null"} as NullVal;
}

function evaluateNumericBinExp(lhs: NumVal, rhs:NumVal, op:string): NumVal {
    let res = 0;
    switch (op){
        case "+":
            res = lhs.value + rhs.value;
        case "-":
            res = lhs.value - rhs.value;
        case "*":
            res = lhs.value * rhs.value;
        case "/":
            //check for division by 0
            res = lhs.value / rhs.value;
        case "%":
            res = lhs.value % rhs.value;
    }

    return {value:res, type:"number"} as NumVal;
}

function evaluateProgram(program: Program): Runtime {
    let lastEval:Runtime = {type:"null", value:"null"} as NullVal;

    for (const statement of program.body){
        lastEval = evaluate(statement);
    }

    return lastEval;
}

export function evaluate(astNode: State): Runtime {

    switch (astNode.kind) {

        case "NumericLiteral":
            return {
                value: (astNode as NumericLiteral).value,
                type: "number",
            } as NumVal;

        case "NullLiteral":
            return {
                value: "null",
                type: "null",
            }as NullVal;

        case "BinaryExp":
            return evaluateBinExp(astNode as BinaryExp);

        case "Program":
            return evaluateProgram(astNode as Program);

        default:
            console.error("Unexpected AST node.");
            process.exit(0);
    }
}
