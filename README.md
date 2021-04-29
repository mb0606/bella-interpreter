# Bella Semantics and Interpreter

Bella is a simple programming language designed in a Programming Language Semantics class.

## Example

```
let x = 3;
while x < 10 {
  print x;
  x = x + 2;
}
```

This program outputs 3 5 7 9

## Abstract Syntax

```
p: Prog
c: Cond
e: Exp
s: Stmt
i: Ide
n: Numeral

Prog ::= s*
Exp  ::= n | i | e + e | e - e | e * e | e / e
      |  e ** e | - e | i e* | c ? e1 : e2
Cond ::= true | false | ~ c | c && c | c || c
      |  e == e | e != e | e < e | e <= e
      |  e > e | e >= e
Stmt ::= let i e | i = e | while c s* | print e
      |  fun i i* e
```

## Denotational Semantics

```
type File = Num*
type Memory = Ide -> Num  (in JS, a Map; in Python a dict)
type State = Memory x File

P: Prog -> File
E: Exp -> Memory -> Num
S: Stmt -> State -> State
C: Cond -> Memory -> Bool

P [[s*]] = S*[[s*]]({}, [])

S [[let i e]] (m,o) = (m[i])
S [[fun i i* e]] (m,o) = (m[(i*, e)/f], o)
S [[i = e]] (m,o) = (m [E[e]]m/x],o)
S [[print e]] (m,o) = (m, o + E [[e]] m)
S [[while c do s*]] (m,o) = if C [[c]] m = F then (m,o)
                            else (S [[while c do ]]) (S* [[s*]] (m,o))

E [[n]] m = n
E [[i]] m = m i
E [[e1 + e2]] m = E [[e1]] m + E [[e2]] m
E [[e1 - e2]] m = E [[e1]] m - E [[e2]] m
E [[e1 * e2]] m = E [[e1]] m * E [[e2]] m
E [[e1 / e2]] m = E [[e1]] m / E [[e2]] m
E [[e1 % e2]] m = E [[e1]] m % E [[e2]] m
E [[e1 ** e2]] m = E [[e1]] m ** E [[e2]] m
E [[- e]] m = - E [[e]] m
E [[i(a*)]] m = let (p*,e) = m[i] in E[[e]] m[E[ai]m / pi]]i
E [[c ? e1 : e2]] m = if E [[c]] m = T then E [[e1]] m else E [[e2]] m

C [[true]] m = T
C [[false]] m = F
C [[e1 == e2]] m = E [[e1]] m = E [[e2]] m
C [[e1 != e2]] m = not (E [[e1]] m = E [[e2]] m)
C [[e1 < e2]] m = E [[e1]] m < E [[e2]] m
C [[e1 <= e2]] m = E [[e1]] m <= E [[e2]] m
C [[e1 > e2]] m = E [[e1]] m > E [[e2]] m
C [[e1 >= e2]] m = E [[e1]] m >= E [[e2]] m
C [[~c]] m = not (C [[c]] m)
C [[c1 && c2]] m = if C [[c1]] m then C [[c2]] m else F
C [[c1 || c2]] m = if C [[c1]] m then T else C [[c2]] m
```

## Using the Interpreter

```javascript
// Expected value [ 2 ]
interpret(program([vardec("x", 2), print("x")]));

// Expected value [ 3, 5, 7, 9 ]
interpret(
  P(
    program([
      vardec("x", 3),
      whileLoop(less("x", 10), [print("x"), assign("x", plus("x", 2))]),
    ])
  )
);

// Expected value [ 3, false, 11, 13 ]
interpret(
  P(
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
);
```
