/// <reference types="cypress" />

const usuario = {
  nome: 'Usuario Login',
  email: `usuario.login.${Date.now()}@example.com`,
  senha: 'senha123'
};

function preencherLogin(email: string, senha: string) {
  cy.contains('label', 'Email').find('input').clear().type(email);
  cy.aguardarVisualizacao();
  cy.contains('label', 'Senha').find('input').clear().type(senha);
  cy.aguardarVisualizacao();
}

describe('Login de usuario', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('deve realizar login com sucesso e abrir a tela de Lista de Tarefas', () => {
    cy.request('POST', 'http://localhost:3000/api/usuarios', usuario).then((response) => {
      expect(response.status).to.equal(201);
    });

    cy.visit('/');
    cy.aguardarVisualizacao();
    preencherLogin(usuario.email, usuario.senha);
    cy.contains('button', 'Entrar').click();
    cy.aguardarVisualizacao();

    cy.contains('h1', 'Minhas tarefas').should('be.visible');
    cy.contains('span', 'Lista de Tarefas').should('be.visible');
    cy.contains('h2', 'Nova tarefa').should('be.visible');
  });

  it('deve exibir mensagem de erro ao informar senha invalida', () => {
    cy.request('POST', 'http://localhost:3000/api/usuarios', {
      nome: 'Usuario Senha Invalida',
      email: `usuario.senha.invalida.${Date.now()}@example.com`,
      senha: 'senha123'
    }).then((response) => {
      expect(response.status).to.equal(201);
      const email = response.body.email;

      cy.visit('/');
      cy.aguardarVisualizacao();
      preencherLogin(email, 'senha-invalida');
      cy.contains('button', 'Entrar').click();
      cy.aguardarVisualizacao();

      cy.contains('Nao autorizado.').should('be.visible');
      cy.contains('h1', 'Lista de Tarefas').should('be.visible');
    });
  });

  it('nao deve enviar o formulario com campos obrigatorios vazios', () => {
    cy.intercept('POST', '**/api/login').as('loginUsuario');

    cy.visit('/');
    cy.aguardarVisualizacao();
    cy.contains('button', 'Entrar').click();
    cy.aguardarVisualizacao();

    cy.contains('label', 'Email')
      .find('input')
      .then(($input) => {
        expect(($input[0] as HTMLInputElement).validity.valid).to.equal(false);
      });
    cy.get('@loginUsuario.all').should('have.length', 0);
  });
});
