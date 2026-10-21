// variáveis e tipos
console.log("1- Variáveis e tipos\n");
let nome: string = "Gustavo Rafael Schmidt";
let idade: number = 20;
let salario: number = 1700;
let usuarioAtivo: boolean = true;

console.log(`Nome: ${nome}\nIdade: ${idade}\nSalário: ${salario}\nAtivo: ${usuarioAtivo}`);

// corrigir erros de tipo
// errado
// let idade2: number = "20";
console.log("\n2- Corrigir erros de tipo\n");
let idade2: number = 20;

// array de números
console.log("\n3- Array de números\n");
let notas: number[] = [8, 7.5, 9, 10];
notas.push(9.5);

console.log(notas);
console.log(`Quantidade de notas: ${notas.length}`);

// inferência
console.log("\n4- Inferência - deixar o TS deduzir o tipo da variável\n");
let nomeMenina = "Leti";
// erro: o erro acontece pois não é possível atribuir um número a uma variável com a tipagem definida previamente como string
// nomeMenina = 2;
console.log(`Leti é: ${typeof(nomeMenina)}`);

// any e unknown
console.log("\n5- Any e unknow\n");

let um: any = "teste";
let dois: unknown = "oLá";

console.log(um.toUpperCase());

if(typeof dois === "string"){
    console.log(dois.toUpperCase());
};