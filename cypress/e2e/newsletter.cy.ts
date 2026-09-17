describe('Blog do Agi - Newsletter', () => {
  beforeEach(() => {
    // Navega até um artigo real (a partir da listagem "Artigos recentes"),
    // sem fixar um slug específico, já que o widget de newsletter fica na
    // barra lateral das páginas de artigo.
    cy.visitBlog('/');
    cy.get('.wp-block-uagb-post-grid .uagb-post__title a').filter(':visible').first().click();
    cy.get('.jetpack_subscription_widget input[type="email"]').should('exist');
  });

  it('deve exigir um endereço de e-mail no campo de inscrição', () => {
    cy.get('.jetpack_subscription_widget input[type="email"]')
      .first()
      .should('have.attr', 'type', 'email')
      .should('have.attr', 'required');
  });

  it('deve rejeitar um e-mail com formato inválido e aceitar um formato válido', () => {
    // Verificamos apenas a validação nativa do navegador (constraint
    // validation da <input type="email" required>), sem clicar em enviar —
    // submeter de verdade inscreveria um e-mail real na newsletter em
    // produção, o que não é apropriado para uma suíte automatizada.
    cy.get('.jetpack_subscription_widget input[type="email"]')
      .first()
      .type('nao-e-um-email')
      .then(($input) => {
        expect(($input[0] as HTMLInputElement).checkValidity(), 'e-mail inválido').to.be.false;
      });

    cy.get('.jetpack_subscription_widget input[type="email"]')
      .first()
      .clear()
      .type('qa-challenge@example.com')
      .then(($input) => {
        expect(($input[0] as HTMLInputElement).checkValidity(), 'e-mail válido').to.be.true;
      });
  });
});
