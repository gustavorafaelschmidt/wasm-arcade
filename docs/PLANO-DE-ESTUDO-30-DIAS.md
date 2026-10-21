# Plano de Estudo 30 dias — WasmArcade

Oct 19, 2026 · @Gustavo

## Visão geral

Em 30 dias (terça 20/10 a quarta 18/11/2026) você constrói na unha o **WasmArcade**: uma biblioteca web de jogos WebAssembly, com API em NestJS, frontend em Next.js e jogos em C compilados com Emscripten, renderizando via WebGL e WebGPU. No fim, o app vai ao ar de graça, num servidor que não dorme quando ninguém acessa.

A carga prevista é de cerca de 61h: 22 dias úteis de 1–2h (\~33h) e 8 dias de fim de semana de 3–4h (\~28h). Os desafios grandes, os checkpoints e o deploy caem sempre no sábado e no domingo.

| Fase | Dias | Datas | Entrega ao final |
| --- | --- | --- | --- |
| 1. TypeScript e Node puro | D1–D6 | 20/10–25/10 | API de catálogo em Node puro com TS, sem framework |
| 2. NestJS | D7–D13 | 26/10–01/11 | API completa: jogos, usuários, JWT, upload de builds, scores |
| 3. Next.js | D14–D19 | 02/11–07/11 | Catálogo, página do jogo, login e painel admin integrados à API |
| 4. WebAssembly e WebGL | D20–D25 | 08/11–13/11 | Jogo próprio WebGL e port de um jogo open source rodando no app |
| 5. Deploy gratuito | D26–D27 | 14/11–15/11 | WasmArcade no ar, com HTTPS, backup e monitoramento |
| 6. WebGPU | D28–D30 | 16/11–18/11 | Demo e jogo WebGPU com lógica em WASM, publicados em produção |

Premissas adotadas:

- Linguagem única no app: TypeScript, do D1 em diante.
- Banco: PostgreSQL em Docker, acessado com Prisma.
- Jogos: C com Emscripten, aproveitando sua base em C; raylib para o jogo próprio WebGL; SDL2 para o port de um jogo open source; lógica em C + renderização WebGPU em TypeScript para o demo WebGPU.
- Repositório: pasta `wasm-arcade/` no `monorepo.gustavo`, com `apps/api`, `apps/web` e `games/`.
- Ambiente: Kali Linux com GPU NVIDIA. WebGPU no Chrome para Linux pode exigir flag; isso é checado no D20, antes de depender dele.
- Hospedagem: VM Always Free da Oracle Cloud rodando o mesmo Docker Compose, atrás do proxy gratuito da Cloudflare, num subdomínio gratuito is-a.dev. Detalhes e plano B na Fase 5.

## Regras do método

Todo dia segue o mesmo ciclo: estuda, aplica sozinho, me mostra. Nenhum código de solução é entregue pronto.

1. **Estuda (≈30% do tempo).** Leia a teoria indicada na documentação oficial. Eu explico conceitos, comparo abordagens e respondo dúvidas, sem escrever o código do desafio.
2. **Aplica (≈60%).** Faça o desafio do dia digitando tudo. Sem copiar de tutorial, sem IA gerando código.
3. **Me mostra (≈10%).** Cole aqui o código, a saída do terminal ou o erro. Eu reviso, aponto problemas e peço ajustes.

Quando travar, peça dica pelo nível. Só suba de nível depois de 15 minutos tentando no nível anterior.

| Nível | O que você recebe | Exemplo |
| --- | --- | --- |
| 1 | O conceito envolvido e onde ler | "Isso é um problema de narrowing; veja a seção do Handbook" |
| 2 | A direção, sem código | "Seu service não está registrado como provider do módulo" |
| 3 | Pseudocódigo ou esqueleto com lacunas | Assinatura da função e os passos em comentários |

Regras fixas:

- Erros são material de estudo: mande o erro completo antes de pedir dica.
- Um commit ao fim de cada dia, mensagem no formato `dN: <o que foi feito>`.
- Dia perdido não é pulado: o plano desliza um dia, sem comprimir dois em um.
- IA para gerar código só depois do D30, quando você já souber revisar o que ela entrega.

## Arquitetura do WasmArcade

O navegador nunca acessa o banco nem o disco: toda leitura e escrita passa pela API NestJS.

&#91;embedded content: arquitetura do WasmArcade · 5 componentes\]

Você constrói de baixo para cima: banco e API na Fase 2, páginas na Fase 3, GamePlayer no D19, jogos WASM nas Fases 4 e 6 e o deploy na Fase 5.

## Fase 1 — TypeScript e Node na unha (D1–D6)

Ao fim da fase você terá uma API REST de catálogo de jogos em Node puro com TypeScript, sem nenhum framework, e entenderá o que o Nest automatiza por baixo.

### D1 · ter 20/10 · 1–2h — Ambiente e tipos básicos

**Teoria:** o que o TypeScript adiciona ao JavaScript; `tsc` e `tsconfig.json` (`strict`, `target`, `module`, `outDir`); tipos primitivos, arrays, inferência; `any` vs `unknown`.

**Desafio:** crie `wasm-arcade/playground`, inicie o projeto npm, instale o TypeScript e configure o `tsconfig` em modo strict. Escreva funções tipadas que recebem uma lista de títulos de jogos e devolvem estatísticas (total, maior título, títulos em ordem alfabética).

- [ ] `npx tsc` compila sem erros com `strict: true`
- [ ] Nenhum `any` no código
- [ ] O JS gerado roda com `node` a partir de `dist/`

**Me mostra:** o `tsconfig.json`, o código e a saída da execução.

### D2 · qua 21/10 · 1–2h — Modelando dados com tipos

**Teoria:** `type` vs `interface`; propriedades opcionais e `readonly`; union e literal types; narrowing com `typeof`, `in` e discriminated unions; checagem exaustiva com `never`.

**Desafio:** modele o tipo `Game` (id, slug, título, descrição, `renderer: 'webgl' | 'webgpu'`, data de criação). Crie uma função que descreve um jogo de forma diferente para cada renderer usando `switch` exaustivo.

- [ ] Adicionar um terceiro renderer na union quebra a compilação até você tratá-lo
- [ ] Campos que não podem mudar estão como `readonly`

**Me mostra:** os tipos e a mensagem de erro do compilador quando você adiciona o renderer novo.

### D3 · qui 22/10 · 1–2h — Classes, generics e módulos

**Teoria:** classes, `private`, `readonly`, `implements`; generics em funções e classes, com restrição via `extends`; `import`/`export`; ESM vs CommonJS no Node.

**Desafio:** implemente um `InMemoryRepository<T extends { id: string }>` com create, findAll, findById, update e delete. Use-o num `GameRepository`, cada um em seu próprio arquivo.

- [ ] O repositório genérico não conhece nada sobre `Game`
- [ ] `findById` com id inexistente tem retorno tipado que obriga quem chama a tratar o caso

**Me mostra:** os arquivos e um script que exercita todas as operações.

### D4 · sex 23/10 · 1–2h — Assíncrono e módulos do Node

**Teoria:** event loop (revisão do async-lab), `Promise<T>`, `async`/`await` tipados, tratamento de erros; `node:fs/promises` e `node:path`.

**Desafio:** faça o repositório persistir em `games.json`: carrega ao iniciar e salva a cada escrita, de forma assíncrona.

- [ ] Arquivo inexistente na primeira execução não derruba o processo
- [ ] JSON corrompido gera um erro com mensagem clara, não um stack trace cru

**Me mostra:** o código e duas execuções seguidas provando que os dados persistiram.

### D5 · sáb 24/10 · 3–4h — Servidor HTTP sem framework (checkpoint)

**Teoria:** `node:http`; ciclo request/response; métodos, status codes e headers; leitura do body em stream e parse de JSON; convenções REST.

**Desafio:** exponha o repositório como API: `GET /games`, `GET /games/:id`, `POST /games`, `PATCH /games/:id`, `DELETE /games/:id`. Roteamento e validação do body feitos à mão.

- [ ] Status corretos: 200, 201, 204, 400, 404 e 405
- [ ] Body inválido devolve 400 com mensagem dizendo qual campo falhou
- [ ] Todas as rotas testadas com `curl`

**Me mostra:** o código e a sequência de comandos `curl` com as respostas. Anote o que foi mais trabalhoso: é isso que o Nest vai resolver.

### D6 · dom 25/10 · 3–4h — Postgres, SQL e decorators

**Teoria (parte A):** Docker Compose para o banco; SQL essencial (`CREATE TABLE`, chaves primária e estrangeira, `UNIQUE`, `SELECT`, `JOIN`).

**Teoria (parte B):** decorators do TypeScript no modo `experimentalDecorators` (o modo que o Nest usa), `reflect-metadata` e `emitDecoratorMetadata`.

**Desafio A:** suba Postgres com Compose, crie à mão as tabelas `users`, `games` e `scores` via `psql` e escreva consultas: top 10 scores de um jogo com o nome do usuário.

**Desafio B:** crie um decorator de classe `@Controller('/games')` e um de método `@Get('/')` que só gravam metadata. Escreva um mini-router que lê essa metadata e chama o método certo.

- [ ] A consulta de ranking usa `JOIN` e `ORDER BY` com `LIMIT`
- [ ] O mini-router encontra a rota sem nenhum `if` por URL escrito à mão

**Me mostra:** o SQL, o mini-router e uma explicação sua, em até três frases, de como o router descobre as rotas.

## Fase 2 — NestJS (D7–D13)

Ao fim da fase a API do WasmArcade estará completa em `apps/api`: catálogo no Postgres, usuários com JWT, upload dos builds dos jogos e ranking de scores.

### D7 · seg 26/10 · 1–2h — Arquitetura do Nest

**Teoria:** Nest CLI e estrutura de projeto; módulos, controllers e providers; injeção de dependência e escopo; ciclo de vida de uma request. Compare cada peça com o que você fez à mão no D5 e no D6.

**Desafio:** crie `apps/api` com o CLI e um `GamesModule` com CRUD em memória (controller + service), sem olhar o código do D5.

- [ ] O controller não contém lógica de negócio, só delega ao service
- [ ] O service é injetado pelo construtor, nunca instanciado com `new`

**Me mostra:** o módulo e uma lista sua: o que o Nest fez por você em relação ao D5.

### D8 · ter 27/10 · 1–2h — DTOs, validação e erros

**Teoria:** DTOs; `ValidationPipe` global com `class-validator` e `class-transformer` (`whitelist`, `forbidNonWhitelisted`, `transform`); pipes de parâmetro; exceptions HTTP nativas; exception filters.

**Desafio:** crie `CreateGameDto` e `UpdateGameDto` (este derivado do primeiro). Escreva um exception filter que padroniza todo erro da API no formato `{ statusCode, error, message, path, timestamp }`.

- [ ] Campo extra no body é rejeitado com 400
- [ ] `renderer` aceita somente `webgl` ou `webgpu`
- [ ] Id inexistente devolve 404 no formato padrão

**Me mostra:** os DTOs, o filter e três `curl` de erro.

### D9 · qua 28/10 · 1–2h — Prisma e Postgres

**Teoria:** ORM vs SQL puro; `schema.prisma`, modelos e relações; migrations; Prisma Client; um `PrismaService` como provider do Nest.

**Desafio:** modele `User`, `Game` e `Score` com as mesmas relações das tabelas do D6, gere a migration e troque o armazenamento em memória do `GamesService` pelo Prisma.

- [ ] Slug duplicado devolve 409 Conflict, não 500
- [ ] A migration recria o banco do zero sem passos manuais

**Me mostra:** o schema, a migration gerada e como você tratou o erro de unicidade.

### D10 · qui 29/10 · 1–2h — Configuração, consultas e documentação

**Teoria:** `@nestjs/config` com validação das variáveis de ambiente; paginação e filtros via query string; OpenAPI com `@nestjs/swagger`.

**Desafio:** `GET /games` com `?renderer=`, `?search=`, `?page=` e `?limit=`, devolvendo itens e total. A API deve recusar iniciar sem `DATABASE_URL`. Publique a documentação em `/docs`.

- [ ] `limit` acima de 50 é rejeitado
- [ ] Todas as rotas aparecem documentadas no Swagger com seus DTOs

**Me mostra:** a tela do Swagger e a resposta de uma consulta filtrada.

### D11 · sex 30/10 · 1–2h — Testes

**Teoria:** testes unitários vs e2e; Jest no Nest; `Test.createTestingModule`; mocks de providers; `supertest`.

**Desafio:** testes unitários do `GamesService` com o Prisma mockado, cobrindo sucesso, 404 e 409. Um teste e2e do fluxo criar → buscar → remover jogo.

- [ ] Os testes unitários rodam sem banco
- [ ] Você quebra o código de propósito e um teste falha pelo motivo certo

**Me mostra:** a saída do `npm test` e o teste que falhou de propósito.

### D12 · sáb 31/10 · 3–4h — Usuários e autenticação

**Teoria:** hash de senha (bcrypt ou argon2); JWT (estrutura, assinatura, expiração); Passport com estratégias local e JWT; guards; custom decorators; autorização por papel.

**Desafio:** `UsersModule` e `AuthModule` com `POST /auth/register`, `POST /auth/login` e `GET /auth/me`. Crie `@CurrentUser()` e um `RolesGuard` com `@Roles('admin')`. Criar, editar e remover jogos passa a exigir admin.

- [ ] A senha nunca aparece em nenhuma resposta
- [ ] Token expirado ou adulterado devolve 401; usuário sem papel devolve 403

**Me mostra:** o fluxo completo em `curl` e o payload do token decodificado.

### D13 · dom 01/11 · 3–4h — Builds dos jogos e scores (checkpoint)

**Teoria:** upload multipart com Multer (`FilesInterceptor`); validação de arquivo; servir arquivos estáticos; por que `.wasm` precisa do header `Content-Type: application/wasm`; CORS.

**Desafio:** `POST /games/:id/build` (admin) recebe o `.js` e o `.wasm` gerados pelo Emscripten, mais o .data opcional de assets, e salva em `storage/games/<slug>/`. Sirva esses arquivos em `/static/games/<slug>/`. Crie `POST /games/:id/scores` (usuário logado) e `GET /games/:id/scores` (top 10). Coloque API e banco no mesmo Compose.

- [ ] Upload com extensão errada ou acima do limite é rejeitado
- [ ] `curl -I` do `.wasm` mostra o Content-Type correto
- [ ] `docker compose up` sobe API e banco do zero

**Me mostra:** o `compose.yaml`, o `curl -I` e o ranking de um jogo com três scores.

## Fase 3 — Next.js (D14–D19)

Ao fim da fase o frontend em `apps/web` estará integrado à API: catálogo, página de cada jogo com ranking, login e painel admin, e um player pronto para receber os jogos WASM.

### D14 · seg 02/11 · 1–2h — React com TypeScript e App Router

**Teoria:** componentes, JSX e props tipadas; `useState`, eventos, listas e `key`; estrutura do App Router (`app/`, `layout.tsx`, `page.tsx`, `Link`); Tailwind CSS básico.

**Desafio:** crie `apps/web`, um layout com cabeçalho e navegação, e uma home com cards de jogos a partir de dados fixos. Um componente `GameCard` tipado e um filtro por renderer feito com estado local.

- [ ] As props do `GameCard` reutilizam o tipo `Game` em vez de redeclarar campos
- [ ] Nenhum aviso de `key` no console

**Me mostra:** o componente, a página e um print da home.

### D15 · ter 03/11 · 1–2h — Server Components e busca de dados

**Teoria:** Server vs Client Components e `'use client'`; `fetch` no servidor; cache e revalidação; `searchParams`; variáveis de ambiente públicas e privadas.

**Desafio:** a rota `/games` lista os jogos vindos da API Nest, com filtro por renderer e paginação controlados pela URL.

- [ ] O filtro funciona com JavaScript desligado no navegador
- [ ] A URL da API vem de variável de ambiente, nunca fixa no código

**Me mostra:** o código da página e uma explicação de quais componentes rodam no servidor e por quê.

### D16 · qua 04/11 · 1–2h — Rotas dinâmicas e estados de página

**Teoria:** segmentos dinâmicos (`[slug]`); `generateMetadata`; `notFound()`; `loading.tsx` e `error.tsx`.

**Desafio:** a página `/games/[slug]` mostra detalhes e o top 10 de scores, com título da aba dinâmico.

- [ ] Slug inexistente cai na página 404 do Next
- [ ] API fora do ar mostra o `error.tsx`, não uma tela branca

**Me mostra:** prints dos três estados (ok, 404 e erro).

### D17 · qui 05/11 · 1–2h — Autenticação no frontend

**Teoria:** Server Actions e Route Handlers; cookies `httpOnly`; por que não guardar JWT em `localStorage`; middleware do Next.

**Desafio:** páginas `/login` e `/register` que chamam a API; o token fica num cookie `httpOnly`. O middleware bloqueia `/admin` para quem não estiver logado. O cabeçalho mostra o usuário e um botão de sair.

- [ ] O token não é acessível por `document.cookie`
- [ ] Erro de login aparece no formulário, sem recarregar a página inteira

**Me mostra:** o fluxo login → admin → logout e o cookie no DevTools.

### D18 · sex 06/11 · 1–2h — Painel admin

**Teoria:** formulários com Server Actions; `useActionState` para feedback; envio multipart com `FormData`; `revalidatePath`.

**Desafio:** em `/admin`, criar e editar jogos e enviar o build (`.js` + `.wasm`) para a API.

- [ ] Após criar um jogo, o catálogo mostra o novo item sem reiniciar nada
- [ ] Erros de validação da API aparecem ao lado do campo certo

**Me mostra:** o formulário funcionando e a pasta `storage/` com o build salvo.

### D19 · sáb 07/11 · 3–4h — Player de jogos e Compose completo (checkpoint)

**Teoria:** ciclo de vida no React (`useEffect` e cleanup); carregar um script externo sob demanda; `<canvas>`; detecção de suporte a WebGL e a WebGPU (`navigator.gpu`); Dockerfile para Next.

**Desafio:** crie o componente cliente `GamePlayer`: recebe o slug, verifica suporte do navegador ao renderer, carrega o script do build e mostra os estados carregando, erro e rodando. Teste com um script falso que só pinta o canvas. Coloque web, API e banco no mesmo Compose.

- [ ] Sair da página do jogo remove o script e libera o canvas
- [ ] Navegador sem WebGPU vê uma mensagem clara em vez de erro
- [ ] `docker compose up` sobe os três serviços do zero

**Me mostra:** o `GamePlayer`, o `compose.yaml` final e o fluxo completo: cadastro, criação do jogo, upload e catálogo.

## Fase 4 — WebAssembly e WebGL (D20–D25)

Ao fim da fase o WasmArcade terá dois jogos em C rodando no navegador, ambos integrados à API: seu jogo WebGL com raylib e o port de um jogo open source com SDL2.

### D20 · dom 08/11 · 3–4h — Fundamentos de WASM e Emscripten

**Teoria:** o que é WebAssembly; módulo, instância, memória linear, imports e exports; o formato texto (WAT); `WebAssembly.instantiateStreaming`; o que o glue code do Emscripten faz por você; `EXPORTED_FUNCTIONS`, `ccall` e `cwrap`.

**Desafio A:** escreva uma função em WAT, converta para `.wasm` e carregue à mão em JS, sem Emscripten.

**Desafio B:** instale o emsdk e compile um arquivo C que guarda posições e velocidades de 100 partículas num array e exporta uma função `step(dt)`. O JS chama `step` e lê as posições direto da memória linear. Guarde esse código: ele volta no D29.

- [ ] Você explica a diferença entre ler o array pela memória e chamar uma função por partícula
- [ ] `chrome://gpu` confirma WebGPU ativo no Kali; se não estiver, habilite antes do D28

**Me mostra:** o WAT e o C das partículas com o JS que lê a memória.

### D21 · seg 09/11 · 1–2h — raylib na web e o game loop

**Teoria:** como a raylib chega ao WebGL; compilar a raylib para a plataforma web; game loop com `emscripten_set_main_loop`; delta time; entrada de teclado.

**Desafio:** compile a raylib para a web e faça um retângulo se mover com o teclado, com velocidade definida em pixels por segundo.

- [ ] O mesmo código C compila para desktop e para web
- [ ] A velocidade não depende da taxa de quadros do monitor

**Me mostra:** o comando de build e o retângulo rodando no navegador.

### D22 · ter 10/11 · 1–2h — Jogo WebGL próprio

**Teoria:** estados de jogo (menu, partida, fim) como máquina de estados; colisão AABB; placar.

**Desafio:** Pong ou Breakout completo em C: menu, partida, placar e tela de fim de jogo. Em paralelo, escolha o jogo open source do D24 e me mande o repositório para validarmos.

- [ ] Os estados do jogo ficam num `enum`, sem flags booleanas soltas
- [ ] As colisões funcionam nas bordas e nos cantos

**Me mostra:** o C e o jogo rodando no navegador.

### D23 · qua 11/11 · 1–2h — Integrando o jogo WebGL ao app

**Teoria:** flags `MODULARIZE` e `EXPORT_NAME`; passar o canvas para o módulo; chamar JS a partir do C com `EM_JS`; destruir a instância ao sair da página.

**Desafio:** publique o jogo pelo painel admin e rode-o dentro do `GamePlayer`. No fim da partida, o C avisa o JS com a pontuação e o app envia o score para a API.

- [ ] Entrar e sair da página do jogo três vezes não acumula loops nem memória
- [ ] O score aparece no ranking da página do jogo

**Me mostra:** o fluxo inteiro, do upload ao ranking atualizado.

### D24 · qui 12/11 · 1–2h — Port de um jogo open source: o build

**Teoria:** o que muda ao portar um jogo de desktop: o loop `while` vira `emscripten_set_main_loop`; SDL2 pelo port do Emscripten (`-sUSE_SDL=2`); assets empacotados no `.data` com `--preload-file`; obstáculos comuns (threads, acesso a disco, loops que bloqueiam o navegador).

**Desafio:** compile para a web o jogo validado no D22 e rode-o fora do app, na página HTML que o Emscripten gera. Critérios do jogo: C com SDL2, licença livre (MIT, zlib ou GPL), sem threads, poucos assets e código que você consiga ler numa sessão.

- [ ] O jogo roda sem travar a aba
- [ ] Você lista cada mudança feita no código original e o motivo

**Me mostra:** o diff contra o original e o comando de build.

### D25 · sex 13/11 · 1–2h — Port de um jogo open source: integração

**Teoria:** carregar o `.data` junto com `.js` e `.wasm`; `locateFile` para o Emscripten buscar os arquivos na URL certa; licenças open source e atribuição.

**Desafio:** publique o port no WasmArcade pelo painel admin. Se o jogo tiver pontuação, envie ao ranking com `EM_JS`, como no D23.

- [ ] Os três arquivos carregam de `/static/games/:slug/` sem 404
- [ ] A licença e o link do repositório original aparecem na página do jogo

**Me mostra:** o jogo rodando no app e a aba Network com os três arquivos.

## Fase 5 — Deploy gratuito (D26–D27)

Ao fim da fase o WasmArcade estará no ar num endereço público, com HTTPS, sem dormir quando ninguém acessa e com backup diário do banco.

### Por que esta hospedagem

O app precisa de três coisas: um processo Node sempre ligado (a API), um Postgres persistente e arquivos `.wasm` servidos com o header certo. Comparei as opções gratuitas com esse critério:

| Opção | Dorme sem acesso? | Ponto fraco |
| --- | --- | --- |
| **Oracle Cloud Always Free + Cloudflare (escolhida)** | Não | VM ARM reduzida em 2026 para 2 OCPU e 12 GB; exige cartão na verificação; capacidade ARM pode faltar na região |
| Vercel Hobby + Koyeb + Neon | Sim: Koyeb após 1h, Neon após 5 min | Três painéis; Vercel Hobby só para uso não comercial |
| Render | Sim, após 15 min | Postgres gratuito expira em 30 dias |
| Cloudflare Workers | Não | O NestJS não roda no runtime dos Workers sem reescrever a API |

A Oracle vence porque roda o seu Compose inteiro sempre ligado: o `compose.yaml` do D19 vira a produção. A Cloudflare entra na frente de graça, com HTTPS público, cache e proteção contra DDoS, e o is-a.dev dá o subdomínio sem custo.

Fontes: [Oracle Always Free](https://docs.oracle.com/en-us/iaas/Content/FreeTier/resourceref.htm), [corte da Oracle em 2026](https://infoq.com/news/2026/07/oracle-cloud-free-tier-limits/), [Koyeb scale-to-zero](https://www.koyeb.com/docs/run-and-scale/scale-to-zero), [planos do Neon](https://neon.com/pricing), [limites do Render](https://livemy.app/blog/render-pricing), [limites dos Workers](https://developers.cloudflare.com/workers/platform/limits/index.md).

**Plano B:** se a Oracle não liberar a VM ARM até o D26, o deploy vai para Vercel (web) + Koyeb (API) + Neon (banco) + Cloudflare R2 (builds), aceitando a espera de alguns segundos quando o serviço acorda.

&#91;embedded content: produção do WasmArcade · VM gratuita atrás da Cloudflare\]

### Preparação antecipada (15 min cada, até o D19)

A Oracle pode demorar a liberar máquina ARM, então estes passos rodam em paralelo às fases 2 e 3:

- [ ] Criar a conta na Oracle Cloud e escolher a região home com cuidado, porque ela não muda depois
- [ ] Criar a VM ARM (Ubuntu, 2 OCPU, 12 GB); se faltar capacidade, tentar de novo nos dias seguintes
- [ ] Com o IP da VM em mãos, abrir o pull request do subdomínio no is-a.dev, que tem revisão manual
- [ ] Criar a conta Cloudflare e um bucket R2 para os backups

### D26 · sáb 14/11 · 3–4h — Servidor e Compose de produção

**Teoria:** hardening básico de servidor (usuário sem root, SSH só por chave, firewall na security list da Oracle e na VM); Docker em ARM e imagens multi-arquitetura; Compose de produção (`.env` fora do Git, `restart`, volumes nomeados, healthchecks); build de produção do Next e do Nest.

**Desafio:** prepare a VM e suba o WasmArcade com um `compose.prod.yaml`. O Postgres não expõe porta para fora e as migrations rodam no deploy.

- [ ] Login por senha no SSH desativado
- [ ] Só as portas 22, 80 e 443 abertas
- [ ] Reiniciar a VM traz os serviços de volta sozinhos

**Me mostra:** o `compose.prod.yaml`, o `docker compose ps` depois de um reboot e as regras de firewall.

### D27 · dom 15/11 · 3–4h — Domínio, HTTPS, backup e monitoramento (checkpoint)

**Teoria:** registros DNS e o proxy da Cloudflare; proxy reverso com Caddy; modos SSL da Cloudflare e certificado na origem; headers de cache para `.wasm`; backup com `pg_dump` e restauração; monitor de uptime externo.

**Desafio:** coloque o Caddy na frente: `/` vai para o Next, `/api` e `/static` vão para o Nest. Aponte o subdomínio is-a.dev para a VM com o proxy da Cloudflare ativo. Agende um backup diário do Postgres enviado ao R2 e configure um monitor de uptime gratuito que avise quando o site cair.

- [ ] O site abre em HTTPS com certificado válido e HTTP redireciona
- [ ] Você restaura um backup num banco vazio e os dados voltam
- [ ] Derrubar a API de propósito gera alerta do monitor
- [ ] Os dois jogos rodam em produção

**Me mostra:** o Caddyfile, o script de backup, o alerta recebido e o link público.

## Fase 6 — WebGPU (D28–D30)

Ao fim da fase o WasmArcade terá um demo e um jogo WebGPU com lógica em C, publicados direto em produção.

### D28 · seg 16/11 · 1–2h — Fundamentos de WebGPU

**Teoria:** adapter e device; contexto do canvas; shaders em WGSL (vertex e fragment); buffers; pipeline; render pass; instancing; comparação com o modelo do WebGL.

**Desafio:** em TypeScript, desenhe um triângulo e depois 100 quadrados por instancing, com posições vindas de um buffer.

- [ ] Navegador sem WebGPU recebe a mensagem do `GamePlayer`, não uma exceção
- [ ] Mudar uma posição no buffer move o quadrado correspondente

**Me mostra:** o WGSL, o TS e o resultado.

### D29 · ter 17/11 · 1–2h — Partículas: o WASM simula, a WebGPU desenha

**Teoria:** dividir responsabilidades: C cuida da simulação, TypeScript cuida da GPU; compartilhar dados pela memória linear sem copiar objeto por objeto; atualizar buffers a cada quadro.

**Desafio:** reaproveite as partículas do D20. A cada quadro o TS lê as posições da memória linear e atualiza o buffer da GPU; o cursor do mouse repele as partículas. Publique em produção como `renderer: webgpu`.

- [ ] Nenhuma chamada C ↔ JS por partícula dentro do loop
- [ ] O demo roda no link público, não só local

**Me mostra:** o link em produção e o desenho, em texto, de como os dados fluem do C até a GPU.

### D30 · qua 18/11 · 1–2h — Jogo WebGPU de esquiva (encerramento)

**Teoria:** nenhum conceito novo: game loop, colisão e score aplicados ao pipeline WebGPU do D29.

**Desafio:** transforme o demo do D29 num jogo: o jogador desvia de blocos que caem, com lógica em C, renderização WebGPU e score enviado à API. Publique em produção e marque o checklist final.

- [ ] O catálogo em produção filtra os quatro itens por renderer
- [ ] O score do jogo aparece no ranking em produção

**Me mostra:** o link do jogo e o checklist final marcado.

Se o D30 não couber em 2h, use o sábado 21/11 como reserva, seguindo a regra de deslizar o plano.

## Checklist final e transição para a IA

Você está pronto para desenvolver com IA quando conseguir marcar todos os itens abaixo sem consultar o código antigo.

- [ ] Explico o caminho de uma request do navegador até o Postgres e de volta, nomeando cada camada
- [ ] Crio um módulo Nest novo (controller, service, DTO, Prisma, teste) do zero em menos de 1h
- [ ] Sei dizer quando um componente Next deve ser Server ou Client e por quê
- [ ] Leio um erro do `tsc`, do Nest ou do Next e chego à causa sem ajuda
- [ ] Compilo C para WASM, porto um jogo C/SDL2 existente e explico memória linear, imports e exports
- [ ] Explico a diferença entre o pipeline do WebGL e o do WebGPU
- [ ] Coloco um app no ar numa VM, com HTTPS, backup e monitoramento, e sei restaurar o banco

Depois do D30, a IA entra como par de programação, não como autora: você descreve a feature, ela propõe, você revisa linha por linha contra este checklist antes de aceitar.

## Referências

Documentação oficial usada como fonte da teoria de cada dia.

| Fase | Referência |
| --- | --- |
| 1 | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) · [API do Node.js](https://nodejs.org/docs/latest/api/) |
| 2 | [Documentação do NestJS](https://docs.nestjs.com) · [Documentação do Prisma](https://www.prisma.io/docs) |
| 3 | [React: Learn](https://react.dev/learn) · [Documentação do Next.js](https://nextjs.org/docs) |
| 4 | [WebAssembly no MDN](https://developer.mozilla.org/en-US/docs/WebAssembly) · [Documentação do Emscripten](https://emscripten.org/docs/) · [raylib](https://www.raylib.com) |
| 5 | [Oracle Always Free](https://docs.oracle.com/en-us/iaas/Content/FreeTier/resourceref.htm) · [is-a.dev](https://github.com/is-a-dev/register) · [Cloudflare R2](https://developers.cloudflare.com/r2/) · [Caddy](https://caddyserver.com/docs/) · [Docker Compose](https://docs.docker.com/compose/) |
| 6 | [WebGPU API no MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) · [WebGPU Fundamentals](https://webgpufundamentals.org) |
