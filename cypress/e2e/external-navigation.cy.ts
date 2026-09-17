describe('Blog do Agi - Navegação externa', () => {
  it('deve levar para o site do Agibank ao clicar em "Ir para o site"', () => {
    cy.visitBlog('/');

    cy.contains('a.menu-link', 'Ir para o site')
      .filter(':visible')
      .first()
      .should('have.attr', 'href')
      .and('include', 'agibank.com.br');

    cy.contains('a.menu-link', 'Ir para o site').filter(':visible').first().click();

    cy.url().should('match', /^https:\/\/agibank\.com\.br\//);
  });
});
