// O Blog do Agi roda o plugin LiteSpeed Cache, que dispara um POST para
// guest.vary.php logo após o carregamento da página e, quando não existe
// cookie de "vary" para a sessão, força um reload completo do documento.
// Isso é sempre o caso em um teste Cypress novo (cookies limpos a cada
// execução), então qualquer clique logo após `cy.visit()` corre o risco de
// acontecer num elemento que está prestes a ser substituído pelo reload.
// Este comando espera essa requisição — e o possível reload que ela pode
// disparar — assentar antes de prosseguir.
Cypress.Commands.add('visitBlog', (path = '/') => {
  cy.intercept('POST', '**/guest.vary.php').as('lsGuestVary');
  cy.visit(path);
  cy.wait('@lsGuestVary', { timeout: 15000 });
  cy.document({ timeout: 15000 }).its('readyState').should('eq', 'complete');
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Visita uma página do blog aguardando o possível reload do LiteSpeed Cache. */
      visitBlog(path?: string): Chainable<void>;
    }
  }
}

export {};
