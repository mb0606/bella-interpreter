function interpret(program) {
  return new P(program)
}

const P = (program) => {
  let statements = program.body
  let w = [{}, []]
  for(let s of statements){
    w = S(s)(w)
  }
  return w[1]
}
const S = (statement)=> ([memory, output]) =>{
  if(statement.constructor === VariableDecaration){

  }
  else if (statement.constructor === PrintStatement){
    let {arguments} = statement
    return [(memory, output.concat(E(argument)(memory)))]
  }
  else if(statement.constructor === WhileStatement){

  }
  if(statement.constructor === VariableDecaration){

  }

}
const  E = (expression) =>( memory) => {
  if(typeof expression === 'number'){
    return expression
  } else if(typeof expression === "string"){
    const i = expression
    return memory[i] // 
  } else if (expression.constructor === Unary ){
    return -E(expression)(memory)
  } else if (expression.constructor === Binary){
    const {op, right, left} = expression
    switch(op){
      case "+":
        return E(right)(memory) + E(left)(memory)
      case "-":
        return E(right)(memory) - E(left)(memory)
      case "*":
        return E(right)(memory) * E(left)(memory)
      case "/":
        return E(right)(memory) / E(left)(memory)
      case "**":
        return E(right)(memory) ** E(left)(memory)
      // case "**":
      //   return E(right)(memory) ** E(left)(memory)
    }
    return -E(expression)(memory)
  }
}
const C = (condition) => (memory) =>  {
  if(condition === true) {
    return true
  } else if(condition === false){
    return false
  } else if(condition.constructor === Binary){
    const {op, right, left} = condition
    const x = E(right)(memory)
    const y = E(left)(memory)
    switch(op) {
      case "==":
        return  E(right)(memory) == E(left)(memory)
      case "!=":
        return  E(right)(memory) != E(left)(memory)
      case "<":
        return  E(right)(memory) < E(left)(memory)
      case "<=":
        return  E(right)(memory) <= E(left)(memory)
      case ">":
        return  E(right)(memory) > E(left)(memory)
      case ">=":
        return  right >= left
      case "&&":
        return  C(left)(memory) >= C(left)(memory)
      case ">=":
        return  C(left)(memory) >= C(left)(memory)
    }
  
  } else if(condition.constructor === Unary){
    return !C(operand)(memory)
  }
}


///// nodes
class Program {
  constructor(body) {
    Object.assign(this, {body})
  }
}

class WhileStatement {
  constructor(c, b) {
    Object.assign(this, {c, b})
  }
}
class VariableDecaration {
  constructor(variable, initializer) {
    Object.assign(this, {variable, initializer})
  }
}
class Assignment{
  constructor()
}

class Binary {
  constructor(op, left, right){
    Object.assign(this, {op, left, right})
  }
}
class Unary {
  constructor(op, operand) {
    Object.assign(this, {op, operand})
  }
}
class PrintStatement {
  constructor(arguments){
    this.arguments = arguments
  }
}

class FunctionDeclaration{
  constructor(name, parameters, body){
    Object.assign(this, name, parameters,body )
  }
}



const program = s => new Program(s)
const vardec = (i, e) => new VariableDecaration(i, e)
const print = (e) =>  new Print(e)
const whileLoop = (c, b) => new WhileStatement(c, b)
const plus = (x, y) => new Binary("+", x, y)
const minus =(x, y) => new Binary("-", x, y)
const times =(x, y) => new Binary("*", x, y)
const remainder = (x, y) => new Binary("%", x, y)
const power = (x, y) => new Binary("**", x, y)
const eq = (x, y) => new Binary("==", x, y)
const nteq = (x, y) => new Binary("!=", x, y)
const less = (x, y) => new Binary("<", x, y)
const lesseg = (x, y) => new Binary("<=", x, y)
const greater = (x, y) => new Binary(">", x, y)
const greatereg = (x, y) => new Binary(">=", x, y)
const and = (x, y)  => new Binary("&&", x, y)
const or = (x, y)  => new Binary("||", x, y)

const assign = (i, e) => new Assignment(i, e)






console.log(interpret(
  program([
    vardec("x", 2), 
    print("x")
  ])
))


console.log(interpret(
  program([
    vardec("x", 10), 
    whileLoop(less("x", 10), [
      print("x"), 
      assign("x", plus("x", 2)),
    ])
  ])
))

console.log(E(plus("x", "y")))({x:5, y: 5})

