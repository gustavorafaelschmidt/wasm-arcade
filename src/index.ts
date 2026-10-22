// D1 · ter 20/10 · 1–2h — Ambiente e tipos básicos
// Desafio: Escreva funções tipadas que recebem uma lista de títulos de jogos e devolvem estatísticas 
// (total, maior título, títulos em ordem alfabética).

// Define um array com jogos, a ideia é usar nomes com letras maiúsculas, minúsculas e números para posterior validação
const listaMeusJogos: string[] = ["God of War III", "Grand Theft Auto VI", "Grand Theft Auto V", "Minecraft", "League of Legends", "Cyberpunk 2077", "zelda", "the witcher 3", "Éden"];

// Define o tipo de dados que a função retornarEstatisticasJogos vai retornar
// Serve para garantir que a função retorne exatamente esse padrão de dados, se não retornar o TypeScript vai dar erro
type EstatisticasListaDeJogos = {
    totalDeJogos: number;
    maiorTitulo: string;
    titulosOrdenados: string[];
};

// Define a função que procura o maior título de um array (em caracteres)
// Essa função usa um loop for...of que compara o tamanho do elemento atual com o próximo e substitui o valor do atual pelo elemento de maior valor
function procurarMaiorTitulo(listaDeJogos: string[]): string{
    let tituloAtual: string = listaDeJogos[0];

    for(const titulo of listaDeJogos){
        if(titulo.length > tituloAtual.length){
            tituloAtual = titulo;
        }
    }

    return tituloAtual;
}

function retornarEstatisticasDeJogos(listaDeJogos: string[]): EstatisticasListaDeJogos{
    
    const totalDeJogos: number = listaDeJogos.length;
    const maiorTitulo: string = procurarMaiorTitulo(listaDeJogos);
    const titulosOrdenados: string[] = listaDeJogos.sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));

    const estatisticasJogos = {
        totalDeJogos,
        maiorTitulo,
        titulosOrdenados,
    };

    return estatisticasJogos;
}

console.log(retornarEstatisticasDeJogos([]));