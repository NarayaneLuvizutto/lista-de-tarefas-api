/// <reference types="cypress" />

const novoUsuario = {
  nome: 'Maria Silva',
  email: 'maria.silva@example.com',
  senha: 'senha123'
};

function acessarTelaDeCadastro() {
  cy.visit('/');
  cy.aguardarVisualizacao();
  cy.contains('button', 'Criar uma conta').click();
  cy.contains('h1', 'Criar conta').should('be.visible');
  cy.aguardarVisualizacao();
}

function preencherCadastro(usuario = novoUsuario) {
  cy.contains('label', 'Nome').find('input').clear().type(usuario.nome);
  cy.aguardarVisualizacao();
  cy.contains('label', 'Email').find('input').clear().type(usuario.email);
  cy.aguardarVisualizacao();
  cy.contains('label', 'Senha').find('input').clear().type(usuario.senha);
  cy.aguardarVisualizacao();
}

describe('Cadastro de usuario', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('deve cadastrar um usuario com dados validos', () => {
    cy.clock();
    cy.intercept('POST', '**/api/usuarios', {
      statusCode: 201,
      body: {
        id: 1,
        nome: novoUsuario.nome,
        email: novoUsuario.email
      }
    }).as('cadastrarUsuario');

    acessarTelaDeCadastro();
    preencherCadastro();
    cy.contains('button', 'Criar conta').click();
    cy.aguardarVisualizacao();

    cy.wait('@cadastrarUsuario')
      .its('request.body')
      .should('deep.equal', novoUsuario);
    cy.contains('Conta criada. Voce ja pode entrar.').should('be.visible');
    cy.aguardarVisualizacao();

    cy.tick(700);
    cy.contains('h1', 'Lista de Tarefas').should('be.visible');
  });

  it('deve exibir mensagem quando o email ja estiver cadastrado', () => {
    cy.intercept('POST', '**/api/usuarios', {
      statusCode: 409,
      body: {
        mensagem: 'Email ja cadastrado.'
      }
    }).as('cadastrarUsuario');

    acessarTelaDeCadastro();
    preencherCadastro();
    cy.contains('button', 'Criar conta').click();
    cy.aguardarVisualizacao();

    cy.wait('@cadastrarUsuario');
    cy.contains('Email ja cadastrado.').should('be.visible');
    cy.contains('h1', 'Criar conta').should('be.visible');
  });

  it('nao deve enviar o formulario com campos obrigatorios vazios', () => {
    cy.intercept('POST', '**/api/usuarios').as('cadastrarUsuario');

    acessarTelaDeCadastro();
    cy.contains('button', 'Criar conta').click();
    cy.aguardarVisualizacao();

    cy.contains('label', 'Nome')
      .find('input')
      .then(($input) => {
        expect(($input[0] as HTMLInputElement).validity.valid).to.equal(false);
      });
    cy.get('@cadastrarUsuario.all').should('have.length', 0);
  });
});
