declare namespace Cypress {
  interface Chainable<Subject> {
    inputText(attr: string, str: string): Chainable<any>;
    inputTextArea(index: number, text: string): Chainable<any>;
    inputDecimal(index: number, value: number): Chainable<any>;
  }
}


Cypress.Commands.add("inputTextArea", (index: number, text: string) => {
  cy.get("textarea")
    .eq(index)
    .scrollIntoView()
    .should("be.visible")
    .clear()
    .type(text);
});

Cypress.Commands.add("inputDecimal", (index: number, value: number) => {
  cy.get('input[inputmode="decimal"]')
    .eq(index)
    .scrollIntoView()
    .clear()
    .type(value.toString());
});

Cypress.Commands.add("inputText", (attr: string, str: string) => {
  cy.getByTestAttribute(attr).scrollIntoView().click({ force: true });
  cy.getByTestAttribute(attr).scrollIntoView().clear().type(str);
});
