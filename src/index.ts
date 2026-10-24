// D1 · ter 20/10 · 1–2h — Ambiente e tipos básicos
// Desafio: Escreva funções tipadas que recebem uma lista de títulos de jogos e devolvem estatísticas 
// (total, maior título, títulos em ordem alfabética).

// Declara e inicializa uma lista vazia para testar e validar a função retornarEstatisticasDeJogos() posteriormente
const listaVazia : string[] = [];

// Declara e inicializa um array com nomes de jogos com letras maiúsculas, minúsculas e números para usar na função retornarEstatisticasDeJogos() e validá-la posteriormente
const listaMeusJogos: string[] = ["God of War III", "Grand Theft Auto VI", "Grand Theft Auto V", "Minecraft", "League of Legends", "Cyberpunk 2077", "zelda", "the witcher 3", "Éden", "God of War I", "god of war ii"];

// Define o tipo de dados que a função retornarEstatisticasDeJogos() vai retornar
// Serve para garantir que a função retorne exatamente esse padrão de dados, senão o TypeScript vai acusar erro
type EstatisticasListaDeJogos = {
    totalDeJogos: number;
    maiorTitulo: string | undefined;
    titulosOrdenados: string[];
};

// Define a função que procura o maior título de um array (em caracteres)
// Essa função usa um loop for...of que percorre cada elemento (título) da lista informada e no fim armazena e retorna o maior
// A função pode retornar uma string (o maior título da lista informada) ou undefined (caso a lista informada seja vazia) 
function procurarMaiorTitulo(listaDeJogos: string[]): string | undefined {
    // Declara e inicializa a variável tituloAtual para guardar o primeiro elemento do array informado na função
    let tituloAtual: string | undefined = listaDeJogos[0];

    // Faz a validação e o tratamento caso a variável seja undefined
    // A variável vai ser undefined se a lista inserida for vazia
    if(tituloAtual === undefined){
        return undefined;
    }

    // Percorre cada elemento (título) da lista informada, compara se o tamanho do título percorrido é maior do que o título atual e substitui a variável tituloAtual se for maior
    for(const titulo of listaDeJogos){
        if(titulo.length > tituloAtual.length){
            tituloAtual = titulo;
        }
    }

    // Retorna a variável tituloAtual que está armazenada com o maior título da lista informada (array)
    return tituloAtual;
}

// Define a função retornarEstatisticasDeJogos() que recebe uma lista (array) de jogos e devolve um objeto que segue o tipo EstatisticasListaDeJogos
function retornarEstatisticasDeJogos(listaDeJogos: string[]): EstatisticasListaDeJogos{
    // Declara e inicializa a constante listaDeJogosDuplicada (array), que duplica a listaDeJogos original para posterior tratamento com a função sort() que modifica a lista informada originalmente
    const listaDeJogosDuplicada: string[] = [...listaDeJogos];

    // Declara e inicializa a constante totalDeJogos, o valor dela é o número de elementos da lista (array)
    const totalDeJogos: number = listaDeJogos.length;
    // Declara e inicializa a constante maiorTitulo, pode ser string ou undefined, o valor dela vem da função procurarMaiorTitulo()
    const maiorTitulo: string | undefined = procurarMaiorTitulo(listaDeJogos);
    // Declara e inicializa a constante titulosOrdenados, o valor desse array vem da lista (array) de jogos duplicada mais uma função que ordena os elementos do array com base na lingua pt-BR e compara todos os elementos do array ignorando a diferença entre maiúsculas, minúsculas e acentos, sem alterar o array informado (somente a função sort() altera) (sensitivity: 'base')
    const titulosOrdenados: string[] = listaDeJogosDuplicada.sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));

    // Declara e inicializa a constante estatisticasJogos que posteriormente a função vai retornar
    const estatisticasJogos = {
        totalDeJogos,
        maiorTitulo,
        titulosOrdenados,
    };

    // Retorna o objeto estatisticasJogos
    return estatisticasJogos;
}

// Declara e inicializa a constante estatisticasJogos para guardar o valor retornado pela função retornarEstatisticasDeJogos() e fazer posterior validação para tratar o caso do maiorTitulo ser undefined
const estatisticasJogos = retornarEstatisticasDeJogos(listaMeusJogos);

// Valida se a propriedade maiorTitulo é undefined ou não e faz as respectivas tratativas para cada caso
if (estatisticasJogos.maiorTitulo === undefined){
    console.log("A lista inserida está vazia.");
} else {
    console.log(estatisticasJogos);
}