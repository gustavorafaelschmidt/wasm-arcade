// D1 · ter 20/10 · 1–2h — Ambiente e tipos básicos
// Desafio: Escreva funções tipadas que recebem uma lista de títulos de jogos e devolvem estatísticas (total, maior título, títulos em ordem alfabética).

type EstatisticasJogos = {
    total: number;
    maiorTitulo: string;
    titulosOrdenados: string[];
};

function retornaEstatisticasJogos(nomeJogos: string[]): EstatisticasJogos{
    const total: number = 2;
    const maiorTitulo: string = "Grand Theft Auto VI";
    const titulosOrdenados: string[] = ["Grand Theft Auto III", "Grand Theft Auto IV", "Grand Theft Auto V", "Grand Theft Auto VI"]

    const estatisticasJogos = {
        total,
        maiorTitulo,
        titulosOrdenados,
    }

    return estatisticasJogos;
}

console.log(retornaEstatisticasJogos(["Grand Theft Auto III", "Grand Theft Auto IV"]));