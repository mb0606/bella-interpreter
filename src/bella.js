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
  if (statement.constructor === VariableDeclaration) {
    let { variable, initializer } = statement
    let test = [
      { ...memory, [variable]: E(initializer)([memory, output]) },
      output,
    ]
    return test
  } else if (statement.constructor === PrintStatement) {
    let { argument } = statement
    return [memory, [...output, E(argument)([memory, output])]]
  } else if (statement.constructor === Assignment) {
    const { target, source } = statement
    return [{ ...memory, [target]: E(source)([memory, output]) }, output]
  } else if (statement.constructor === WhileStatement) {
    const { test, body } = statement
    let upDatedState = [{ ...memory }, [...output]]
    if (C(test)([memory, output])) {
      body.forEach((stmt) => {
        upDatedState = S(stmt)(upDatedState)
      })
      return S(statement)(upDatedState)
    }
    return [memory, output]
  } else if (statement.constructor === FunctionDeclaration) {
    const { name, parameters, body } = statement
    return [{ ...memory, [name]: { parameters, body } }, output]
  }
}

const E = (expression) => (state) => {
  if (typeof expression === "number") {
    return expression
  } else if (typeof expression === "boolean") {
    return expression
  } else if (typeof expression == "string") {
    const i = expression
    return state[0][i]
  } else if (expression.constructor === Unary) {
    return -E(expression)(state)
  } else if (expression.constructor === Binary) {
    const { op, left, right } = expression
    switch (op) {
      case "+":
        return E(left)(state) + E(right)(state)
      case "-":
        return E(left)(state) - E(right)(state)
      case "*":
        return E(left)(state) * E(right)(state)
      case "/":
        return E(left)(state) / E(right)(state)
      case "%":
        return E(left)(state) % E(right)(state)
      case "**":
        return E(left)(state) ** E(right)(state)
    }
  } else if (expression.constructor === Call) {
    const { id, args } = expression
    let body = state[0][id].body
    let params = state[0][id].parameters
    for (let i = 0; i < args.length; i++) {
      state[0][params[i]] = args[i]
    }
    return E(body)(state)
  } else if (expression.constructor === Ternary) {
    const { test, consequence, alt } = expression
    return C(test)(state) ? E(consequence)(state) : E(alt)(state)
  }
}

const C = (condition) => (state) => {
  if (condition === true) {
    return true
  } else if (condition === false) {
    return false
  } else if (condition.constructor === Binary) {
    const { op, left, right } = condition
    switch (op) {
      case "==":
        return E(left)(state) === E(right)(state)
      case "!=":
        return E(left)(state) !== E(right)(state)
      case "<":
        return E(left)(state) < E(right)(state)
      case "<=":
        return E(left)(state) <= E(right)(state)
      case ">":
        return E(left)(state) >= E(right)(state)
      case ">=":
        return E(left)(state) >= E(right)(state)
      case "&&":
        return C(left)(state) && C(right)(state)
      case "||":
        return C(left)(state) || C(right)(state)
    }
  } else if (condition.constructor === Unary) {
    const { op, operand } = condition
    return !C(operand)(state)
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

///////////////////////
/////// TESTS /////////
///////////////////////

// Expected value [ 2 ]
console.log(interpret(program([vardec("x", 2), print("x")])))
// Expected value [ 3, 5, 7, 9 ]
console.log(
  interpret(
    program([
      vardec("x", 3),
      whileLoop(less("x", 10), [print("x"), assign("x", plus("x", 2))]),
    ])
  )
)
// Expected value [ 3, false, 11, 13 ]
console.log(
  interpret(
    program([
      fundec("add", ["a", "b"], plus("a", "b")),
      vardec("x", 3),
      vardec("y", plus("x", 10)),
      assign("x", 11),
      print(call("add", [1, 2])),
      print(ternary(eq(1, 2), true, false)),
      print("x"),
      print("y"),
    ])
  )
)
