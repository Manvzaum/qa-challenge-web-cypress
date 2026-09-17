// BUG CONHECIDO (encontrado durante o desenvolvimento desta suíte):
// Clicar no ícone de lupa (.ast-search-icon a.astra-search-icon) não abre o
// overlay de busca (#ast-seach-full-screen-form) em execução automatizada.
// O tema carrega seus scripts via LiteSpeed Cache "Delay JS Execution"
// somente após a primeira interação do usuário; nesse carregamento, um erro
// de JS do próprio site (`$scope.imagesLoaded is not a function`, de um
// script de carrossel) interrompe a execução do bundle antes que o handler
// de clique da busca seja vinculado — logo o clique fica sem efeito.
// Reproduzido de forma consistente em múltiplas execuções, fora do controle
// desta automação. Ver detalhes no README ("Bugs encontrados").
//
// Diante disso, validamos aqui: (1) que o ponto de entrada da busca (a
// lupa) está presente e acessível no cabeçalho, e (2) o comportamento real
// da pesquisa através do mesmo endpoint GET que o formulário de busca usa
// (?s=termo) quando o overlay funciona.
describe('Blog do Agi - Pesquisa', () => {
  const termoValido = 'financiamento';
  const termoInexistente = 'zzxxqqinexistente999999';

  it('deve exibir o ícone de pesquisa (lupa) no cabeçalho do blog', () => {
    cy.visit('/');

    cy.get('.ast-search-icon a.astra-search-icon')
      .filter(':visible')
      .first()
      .should('be.visible')
      .and('have.attr', 'aria-label')
      .and('match', /pesquis|search/i);
  });

  it('deve pesquisar um termo válido e retornar artigos relacionados', () => {
    cy.visit(`/?s=${termoValido}`);

    cy.get('main#main article').should('have.length.greaterThan', 0);
    cy.get('main#main').should('contain.text', termoValido);
  });

  it('deve pesquisar um termo sem resultados e exibir a mensagem de "nada encontrado"', () => {
    cy.visit(`/?s=${termoInexistente}`);

    cy.get('main#main article').should('have.length', 0);
    cy.get('main#main .no-results').should('be.visible');
  });
});
