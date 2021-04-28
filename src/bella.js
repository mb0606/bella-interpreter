function interpret(program) {
  return P(program)
}

const P = (program) => {
  let statements = program.body
  let w = [{}, []]
  for (let s of statements) {
    w = S(s)(w)
  }
  return w[1]
}

const S = (statement) => ([memory, output]) => {
  console.log("in statement")
  if (statement.constructor === VariableDeclaration) {
    let { variable, initializer } = statement
    let test = [{ ...memory, [variable]: E(initializer)(memory) }, output]
    console.log("this is memory: ", test)
    return test
  } else if (statement.constructor === PrintStatement) {
    let { argument } = statement
    return [memory, [...output, E(argument)(memory)]]
  } else if (statement.constructor === Assignment) {
    const { target, source } = statement
    return [{ ...memory, [target]: E(source)(memory) }, output]
  } else if (statement.constructor === WhileStatement) {
    const { test, body } = statement
    console.log("test", test, "body", body)
    while (C(test)(memory)) {
      body.forEach((stmt) => {
        console.log("in foreach : ", stmt)
        S(stmt)(memory)
        return [memory, output]
      })
    }
  } else if (statement.constructor === FunctionDeclaration) {
    console.log("in function declation: ")
    const { name, parameters, body } = statement
    return [{ ...memory, [name]: { parameters, body } }, output]
  } else if (Array.isArray(statement)) {
  }
}

const E = (expression) => (memory) => {
  if (typeof expression === "number") {
    return expression
  } else if (typeof expression === "boolean") {
    return expression
  } else if (typeof expression == "string") {
    const i = expression
    return memory[i]
  } else if (expression.constructor === Unary) {
    return -E(expression)(memory)
  } else if (expression.constructor === Binary) {
    const { op, left, right } = expression
    switch (op) {
      case "+":
        return E(left)(memory) + E(right)(memory)
      case "-":
        return E(left)(memory) - E(right)(memory)
      case "*":
        return E(left)(memory) * E(right)(memory)
      case "/":
        return E(left)(memory) / E(right)(memory)
      case "%":
        return E(left)(memory) % E(right)(memory)
      case "**":
        return E(left)(memory) ** E(right)(memory)
    }
  } else if (expression.constructor === Call) {
    const { id, args } = expression
    let body = memory[id].body
    let params = memory[id].parameters
    for (let i = 0; i < args.length; i++) {
      memory[params[i]] = args[i]
    }
    return E(body)(memory)
  } else if (expression.constructor === Ternary) {
    const { test, consequence, alt } = expression
    console.log("this is ternary: ", test, consequence, alt)
    return C(test)(memory) ? E(consequence)(memory) : E(alt)(memory)
  }
}

const C = (condition) => (memory) => {
  if (condition === true) {
    return true
  } else if (condition === false) {
    return false
  } else if (condition.constructor === Binary) {
    const { op, left, right } = condition
    switch (op) {
      case "==":
        console.log("---------------checking condition")
        return E(left)(memory) === E(right)(memory)
      case "!=":
        return E(left)(memory) !== E(right)(memory)
      case "<":
        return E(left)(memory) < E(right)(memory)
      case "<=":
        return E(left)(memory) <= E(right)(memory)
      case ">":
        return E(left)(memory) >= E(right)(memory)
      case ">=":
        return E(left)(memory) >= E(right)(memory)
      case "&&":
        return C(left)(memory) && C(right)(memory)
      case "||":
        return C(left)(memory) || C(right)(memory)
    }
  } else if (condition.constructor === Unary) {
    const { op, operand } = condition
    return !C(operand)(memory)
  }
}

class Program {
  constructor(body) {
    this.body = body
  }
}

class VariableDeclaration {
  constructor(variable, initializer) {
    Object.assign(this, { variable, initializer })
  }
}

class FunctionDeclaration {
  constructor(name, parameters, body) {
    Object.assign(this, { name, parameters, body })
  }
}

class PrintStatement {
  constructor(argument) {
    this.argument = argument
  }
}

class WhileStatement {
  constructor(test, body) {
    Object.assign(this, { test, body })
  }
}

class Assignment {
  constructor(target, source) {
    Object.assign(this, { target, source })
  }
}

class Binary {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right })
  }
}

class Unary {
  constructor(op, operand) {
    Object.assign(this, { op, operand })
  }
}

class Ternary {
  constructor(test, consequence, alt) {
    Object.assign(this, {
      test,
      consequence,
      alt,
    })
  }
}
class Call {
  constructor(id, args) {
    Object.assign(this, {
      id,
      args,
    })
  }
}

const program = (s) => new Program(s)
const vardec = (i, e) => new VariableDeclaration(i, e)
const fundec = (n, p, b) => new FunctionDeclaration(n, p, b)
const assign = (t, s) => new Assignment(t, s)
const print = (e) => new PrintStatement(e)
const whileLoop = (c, b) => new WhileStatement(c, b)
const plus = (x, y) => new Binary("+", x, y)
const minus = (x, y) => new Binary("-", x, y)
const times = (x, y) => new Binary("*", x, y)
const remainder = (x, y) => new Binary("%", x, y)
const power = (x, y) => new Binary("**", x, y)
const eq = (x, y) => new Binary("==", x, y)
const noteq = (x, y) => new Binary("!=", x, y)
const less = (x, y) => new Binary("<", x, y)
const lesseq = (x, y) => new Binary("<=", x, y)
const greater = (x, y) => new Binary(">", x, y)
const greatereq = (x, y) => new Binary(">=", x, y)
const and = (x, y) => new Binary("&&", x, y)
const or = (x, y) => new Binary("||", x, y)
const ternary = (t, c, a) => new Ternary(t, c, a)
const call = (i, a) => new Call(i, a)

// console.log(interpret(program([vardec("x", 2), print("x")])))

console.log(
  P(
    program([
      vardec("x", 3),
      whileLoop(less("x", 10), [print("x"), assign("x", plus("x", 2))]),
    ])
  )
)

// console.log(
//   P(
//     program([
//       fundec("add", ["a", "b"], plus("a", "b")),
//       vardec("x", 3),
//       vardec("y", plus("x", 10)),
//       assign("x", 11),
//       print(call("add", [1, 2])),
//       print(ternary(eq(1, 2), true, false)),
//       print("x"),
//       print("y"),
//     ])
//   )
// )
