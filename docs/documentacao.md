# Documentação técnica --- ErgoMais

## 1. Apresentação

O ErgoMais é um projeto educativo desenvolvido para apresentar
orientações gerais de ergonomia aplicadas ao ambiente de estudo e
trabalho. A aplicação reúne uma avaliação das condições do ambiente, um
checklist do posto de estudo e um temporizador para alternar períodos de
concentração e descanso.

O sistema é dividido em front-end e back-end. O front-end utiliza HTML,
CSS e JavaScript. O back-end utiliza Node.js e Express para
disponibilizar a interface e processar as solicitações da API.

## 2. Objetivos

-   Incentivar a observação das condições do local de estudo ou
    trabalho.
-   Ajudar o usuário a conferir aspectos básicos da organização do
    posto.
-   Apresentar sugestões educativas de acordo com as respostas.
-   Oferecer um temporizador simples para organizar foco e pausas.

## 3. Tecnologias e responsabilidades

  -----------------------------------------------------------------------
  Tecnologia                          Utilização no projeto
  ----------------------------------- -----------------------------------
  HTML5                               Estrutura e conteúdo das páginas e
                                      formulários.

  CSS3                                Cores, espaçamentos, componentes,
                                      responsividade e apresentação
                                      visual.

  JavaScript                          Interações dos formulários,
                                      comunicação com a API e
                                      temporizador.

  Node.js                             Ambiente de execução do servidor.

  Express                             Criação do servidor e das rotas da
                                      API.

  Helmet                              Aplicação de cabeçalhos de
                                      segurança HTTP.

  express-rate-limit                  Limitação de solicitações à API.
  -----------------------------------------------------------------------

## 4. Estrutura de diretórios

A organização do projeto é dividida em duas pastas principais:

``` text
ErgoMais/
├── front-end/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── back-end/
│   ├── package.json
│   └── server.js
│
├── docs/
│   └── documentacao.md
│
└── README.md
```

### 4.1 Front-end

A pasta `front-end` contém os arquivos que formam a parte visual e
interativa do sistema:

-   **index.html:** contém a navegação, a apresentação do projeto, os
    formulários de avaliação, o checklist, o temporizador e o rodapé.
-   **style.css:** define a identidade visual, os componentes e os
    ajustes para telas menores.
-   **script.js:** controla os formulários, apresenta os resultados
    recebidos da API e executa o temporizador.

### 4.2 Back-end

A pasta `back-end` contém os arquivos responsáveis pelo servidor e pela
API:

-   **package.json:** informa os dados do projeto, os comandos de
    execução, a versão mínima do Node.js e as dependências.
-   **server.js:** configura o Express, disponibiliza a interface,
    aplica proteções básicas e implementa as rotas da API.

### 4.3 Documentação

A pasta `docs` contém este arquivo, com a descrição técnica e as
orientações de execução do projeto. O `README.md` fica na raiz e
apresenta uma visão geral para quem acessar o repositório.

## 5. Funcionamento do front-end

### 5.1 Avaliação do ambiente

O formulário solicita quatro informações:

  Campo         Valores aceitos
  ------------- ---------------------------------
  Iluminação    `boa`, `fraca`, `forte`
  Ruído         `baixo`, `medio`, `alto`
  Temperatura   `confortavel`, `fria`, `quente`
  Ventilação    `boa`, `ruim`

Ao enviar o formulário, o JavaScript transforma as respostas em um
objeto e faz uma solicitação POST para `/api/ambiente`. A API verifica
se os campos possuem valores permitidos e retorna um título e uma lista
de sugestões.

Quando as condições informadas não exigem uma sugestão específica
cadastrada, a API apresenta orientações gerais sobre a manutenção e a
reavaliação do ambiente. A resposta é exibida na página sem recarregar o
formulário.

### 5.2 Checklist ergonômico

O checklist possui cinco itens:

1.  Cadeira ajustada.
2.  Monitor na altura adequada.
3.  Teclado e mouse bem posicionados.
4.  Mesa organizada.
5.  Pausas durante a rotina.

O JavaScript atualiza a contagem de itens marcados. Ao enviar o
checklist, os cinco valores booleanos são encaminhados por POST para
`/api/posto`.

A API verifica se todos os campos esperados foram enviados como valores
booleanos. Em seguida, retorna sugestões para os itens não marcados. Se
todos estiverem marcados, apresenta uma mensagem informando que o
checklist foi concluído.

### 5.3 Temporizador de foco e pausa

O temporizador oferece três modos:

  Modo               Duração
  ------------- ------------
  Foco            25 minutos
  Pausa            5 minutos
  Pausa longa     15 minutos

Os botões permitem selecionar o modo, iniciar, pausar e reiniciar a
contagem. O JavaScript calcula o tempo restante, atualiza a tela e
informa quando o período termina.

O temporizador é executado no navegador. Ele não depende de uma rota da
API para realizar a contagem.

## 6. API do back-end

A API utiliza JSON nas solicitações e respostas. A constante `API_BASE`
do arquivo `front-end/script.js` define o caminho-base `/api`.

### 6.1 `GET /api/status`

Verifica se o servidor está ativo.

Exemplo de resposta:

``` json
{
  "status": "ok",
  "projeto": "ErgoMais",
  "mensagem": "API funcionando."
}
```

### 6.2 `POST /api/ambiente`

Recebe os quatro campos da avaliação do ambiente.

Exemplo de corpo da solicitação:

``` json
{
  "iluminacao": "boa",
  "ruido": "medio",
  "temperatura": "confortavel",
  "ventilacao": "boa"
}
```

A API valida os valores e retorna um objeto com `title` e `suggestions`.
Se algum campo estiver ausente ou tiver um valor não permitido, retorna
o status HTTP 400 com uma mensagem de erro.

### 6.3 `POST /api/posto`

Recebe os cinco itens do checklist como valores booleanos.

Exemplo de corpo da solicitação:

``` json
{
  "cadeira": true,
  "monitor": true,
  "teclado": false,
  "mesa": true,
  "pausas": false
}
```

A resposta contém `title` e `suggestions`. Os itens não marcados geram
orientações correspondentes. Se todos estiverem marcados, a API retorna
uma mensagem de checklist completo.

### 6.4 `POST /api/rotina`

Recebe a duração escolhida em minutos. Os valores aceitos pelo servidor
são `5`, `15`, `25` e `50`.

Exemplo de corpo da solicitação:

``` json
{
  "minutes": 25
}
```

A resposta informa a duração, o tipo (`foco` ou `pausa`) e uma mensagem
de orientação. Essa rota está implementada no servidor, mas não é
utilizada pelo temporizador atual do `front-end/script.js`.

## 7. Validações e proteção do servidor

O servidor aplica as seguintes medidas:

-   Desativa o cabeçalho que identifica o Express.
-   Utiliza Helmet para configurar cabeçalhos HTTP de segurança.
-   Limita o tamanho do corpo JSON a 20 KB.
-   Aplica limite de 100 solicitações por janela de 15 minutos nas rotas
    sob `/api`.
-   Valida os valores recebidos nos formulários antes de gerar
    respostas.
-   Retorna mensagens de erro quando os dados enviados não são válidos.

Essas medidas são proteções básicas e não representam uma auditoria
completa de segurança.

## 8. Instalação e execução

### Requisitos

-   Node.js versão 20 ou superior.
-   npm.

### Passos

1.  Abra o terminal dentro da pasta `back-end`.
2.  Execute `npm install` para instalar as dependências.
3.  Execute `npm start` para iniciar o servidor.
4.  Abra `http://localhost:3000` no navegador.

O comando `npm run dev` inicia o servidor com o modo de observação de
alterações do Node.js.

O arquivo `server.js` utiliza o caminho `../front-end` para localizar a
interface. Por isso, as pastas `front-end` e `back-end` devem ficar no
mesmo nível dentro da pasta principal do projeto.

A porta padrão é 3000, mas pode ser alterada pela variável de ambiente
`PORT`.

## 9. Limitações conhecidas

-   O projeto não possui banco de dados conectado.
-   As respostas dos formulários são processadas e exibidas, mas não
    ficam salvas para consultas futuras.
-   Não há sistema de cadastro, autenticação ou perfis de usuário
    implementado nos arquivos apresentados.
-   O temporizador funciona no navegador e não registra histórico de
    sessões.
-   A rota `/api/rotina` existe no servidor, mas ainda não está
    integrada à interface atual.
-   As orientações são educativas e gerais, não constituindo laudo ou
    avaliação profissional.

## 10. Possíveis melhorias futuras

Como continuidade do projeto, podem ser consideradas a integração com
banco de dados, a criação de histórico de avaliações, a personalização
das rotinas, a ampliação dos conteúdos educativos e a integração do
temporizador com a API.

Essas melhorias são possibilidades futuras e não fazem parte das
funcionalidades implementadas nesta versão.

## 11. Referência

O rodapé da interface indica a Fundacentro como referência
institucional:

https://www.gov.br/fundacentro/pt-br

## 12. Considerações finais

O ErgoMais reúne recursos simples para incentivar hábitos mais
organizados no ambiente de estudo e trabalho. A combinação de
formulários, checklist e temporizador permite que o usuário observe seu
espaço e receba sugestões educativas de maneira direta. A divisão entre
front-end e back-end organiza o código e facilita a manutenção e a
ampliação do projeto.
