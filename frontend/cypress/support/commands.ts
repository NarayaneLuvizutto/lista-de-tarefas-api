declare global {
  namespace Cypress {
    interface Chainable {
      aguardarVisualizacao(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('aguardarVisualizacao', () => {
  cy.wait(1000);
});

export {};
