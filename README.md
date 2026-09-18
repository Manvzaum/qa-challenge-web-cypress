# QA Challenge — Web | Cypress + TypeScript

## Estrutura do projeto

```
.
├── .github/workflows/ci.yml   # Pipeline do GitHub Actions (typecheck + testes)
├── cypress.config.ts          # Configuração do Cypress (baseUrl, vídeo, retries)
├── cypress/
│   ├── e2e/                   # Os testes em si, um arquivo por cenário/feature
│   └── support/
│       ├── commands.ts        # Comandos customizados reutilizáveis (ex: cy.visitBlog)
│       └── e2e.ts             # Configuração global carregada antes de cada teste
├── package.json                # Scripts (npm test, typecheck etc.) e dependências
└── tsconfig.json               # Configuração do TypeScript
```

## Cenários automatizados

**`cypress/e2e/search.cy.ts` — Pesquisa de artigos**
1. O ícone de pesquisa (lupa) está presente e acessível no cabeçalho.
2. Uma pesquisa com termo válido (`financiamento`) retorna artigos
   relacionados, cuja listagem contém o termo pesquisado.
3. Uma pesquisa com termo inexistente não retorna artigos e exibe a
   mensagem de "nada encontrado".

**`cypress/e2e/article.cy.ts` — Acesso a um artigo**
1. A partir da home, é possível abrir o primeiro artigo da seção "Artigos
   recentes" e chegar à página do artigo.

**`cypress/e2e/external-navigation.cy.ts` — Navegação externa**
1. O item de menu "Ir para o site" aponta para `agibank.com.br` e leva
   corretamente até lá ao ser clicado.

**`cypress/e2e/newsletter.cy.ts` — Inscrição na newsletter**
1. O campo de e-mail do widget de newsletter (presente nas páginas de
   artigo) é obrigatório e do tipo `email`.
2. O campo rejeita um e-mail com formato inválido e aceita um formato
   válido (validação nativa do navegador, sem submeter o formulário —
   ver observação abaixo).

## Bugs encontrados no site (fora do controle desta automação)

Durante o desenvolvimento desta suíte, os seguintes defeitos do site foram
identificados e documentados (não são bugs da automação):

1. **Redirecionamento de domínio**: `https://blogdoagi.com.br` responde com
   um `301` para `https://blog.agibank.com.br`. A suíte já aponta o
   `baseUrl` para o domínio final.
2. **Carrossel "Web Stories" quebrado**: na home, clicar no primeiro link
   visível da página (que originalmente caía no carrossel de Web Stories)
   dispara `TypeError: i.getStories is not a function`. A automação evita
   esse widget, restringindo a interação à seção "Artigos recentes".
3. **Ícone de pesquisa (lupa) não abre o overlay de busca em automação**:
   o tema carrega seus scripts via LiteSpeed Cache ("Delay JS Execution")
   apenas após a primeira interação do usuário. Nesse carregamento, um erro
   de JS do próprio site (`$scope.imagesLoaded is not a function`, de um
   script de carrossel) interrompe a execução do bundle antes que o
   handler de clique da busca seja vinculado — o clique no ícone fica sem
   efeito. Reproduzido de forma consistente em múltiplas execuções. Por
   isso, a suíte valida a presença/acessibilidade do ícone separadamente
   da execução da pesquisa em si (feita via o mesmo endpoint GET —
   `?s=termo` — que o formulário de busca usa).
4. **Reload automático em visitas "novas" (LiteSpeed Cache)**: o plugin
   dispara um `POST` para `guest.vary.php` logo após o carregamento da
   página e, quando não há cookie de "vary" para a sessão — o que é sempre
   o caso em um teste Cypress, já que os cookies são limpos a cada execução
   —, força um reload completo do documento. Um clique feito logo após o
   `cy.visit()` corre o risco de acontecer em um elemento que está prestes
   a ser substituído por esse reload, causando falhas intermitentes. O
   comando customizado `cy.visitBlog()` (`cypress/support/commands.ts`)
   aguarda essa requisição — e o possível reload — assentar antes de
   prosseguir.

## Observações sobre o escopo

- O teste de newsletter valida apenas a validação nativa do formulário
  (campo obrigatório, tipo `email`, aceitação/rejeição de formato) e nunca
  envia o formulário de fato: um envio real inscreveria um e-mail
  verdadeiro na newsletter do Agibank em produção, o que não é apropriado
  para uma suíte automatizada.

## Stack

- Cypress
- TypeScript
- Node.js

## Pré-requisitos

- Node.js 20+
- npm

## Instalação

```bash
npm install
```

## Execução

Headless:

```bash
npm test
```

Interface:

```bash
npm run test:open
```

Chrome:

```bash
npm run test:chrome
```

TypeScript:

```bash
npm run typecheck
```

## Evidências

Em falhas, o Cypress registra screenshots. O vídeo da execução também é
habilitado para execução headless.

## CI

O workflow em `.github/workflows/ci.yml` executa o typecheck e a suíte no
GitHub Actions a cada push/PR nas branches `main`/`master`.