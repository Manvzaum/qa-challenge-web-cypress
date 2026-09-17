describe('Blog do Agi - Artigos', () => {
  it('deve acessar o blog e abrir um artigo a partir da listagem de artigos recentes', () => {
    cy.visitBlog('/');

    // Escopo restrito ao bloco "Artigos recentes" (wp-block-uagb-post-grid).
    // A home também exibe um carrossel de "Web Stories" cujo clique dispara
    // um handler JS de terceiros que não faz parte do fluxo de artigo do blog.
    cy.get('.wp-block-uagb-post-grid .uagb-post__title a')
      .filter(':visible')
      .first()
      .then(($link) => {
        const href = $link.attr('href');

        expect(href, 'link do artigo').to.exist;
        cy.wrap($link).click();
      });

    cy.url().should('include', 'agibank.com.br');
    cy.title().should('not.be.empty');
    cy.get('article, main').should('be.visible');
  });
});
