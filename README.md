# ErgoMais — Ergonomia na prática

Projeto escolar da matéria **Programação de Aplicativos (PA)**, desenvolvido para apresentar ferramentas educativas sobre ergonomia no ambiente de estudo e trabalho.

## Estrutura do projeto

```text
trabalho-ergonomia-pa/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── package.json
│   └── server.js
└── README.md
```

## Tecnologias

- **Frontend:** HTML5, CSS3 e JavaScript.
- **Backend:** Node.js com Express.
- **Segurança básica:** Helmet, limite de requisições na API e validação dos dados recebidos.

## Como executar localmente

É necessário ter Node.js instalado.

1. Abra um terminal na pasta `backend`.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor:

   ```bash
   npm start
   ```

4. Acesse **http://localhost:3000** no navegador.

O servidor disponibiliza os arquivos do frontend e a API no mesmo endereço. Não abra o HTML diretamente pelo explorador de arquivos, porque os formulários precisam fazer requisições para a API.

## Rotas da API

| Método | Rota | Função |
|---|---|---|
| GET | `/api/status` | Verifica se a API está ativa |
| POST | `/api/ambiente` | Analisa as condições do ambiente |
| POST | `/api/posto` | Retorna sugestões para o checklist |
| POST | `/api/rotina` | Retorna orientação para uma duração de foco ou pausa |

As rotas POST recebem e retornam JSON. Os formulários da interface usam `/api/ambiente` e `/api/posto`; o temporizador funciona no navegador e não depende da rota `/api/rotina`.

## Objetivo didático

Demonstrar a separação entre interface (frontend) e lógica do servidor (backend), o uso de requisições HTTP, validação de dados e organização de um projeto web.

## Aviso

O ErgoMais é um recurso educativo. As informações são gerais e não substituem avaliação de profissionais de saúde ou segurança do trabalho.

Referência institucional: [Fundacentro](https://www.gov.br/fundacentro/pt-br).
