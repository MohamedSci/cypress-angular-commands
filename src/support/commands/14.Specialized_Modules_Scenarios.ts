declare namespace Cypress {
  interface Chainable<Subject> {
    prepareBeforeVerifyJournalEntry(transactionCodeIndex: number, transactionDateIndex: number, journalCodeIndex: number): Chainable<any>;
    confirmEmailRegExCompatibility(fieldSelector: string, validEmail: string): Chainable<any>;
    inputSearchDialog(search: string): Chainable<any>;
    checkLink(urlStr: string): Chainable<any>;
    switchingToTreeView(): Chainable<any>;
    switchingToListView(): Chainable<any>;
  }
}

Cypress.Commands.add("switchingToTreeView", () => {
  cy.get('i.pi-sitemap').scrollIntoView().should("be.visible").scrollIntoView().click();
});

Cypress.Commands.add("switchingToListView", () => {
  cy.get('i.pi-bars').scrollIntoView().should("be.visible").scrollIntoView().click();
  cy.get("tbody tr", { timeout: 12000 }).last().scrollIntoView().should("be.visible", { timeout: 45000 });
});

Cypress.Commands.add("checkLink", (url) => {
  return cy
    .request({
      url,
      failOnStatusCode: false,
    })
    .then((resp) => {
      return resp.status;
    });
});

Cypress.Commands.add("inputSearchDialog", (search: string) => {
  cy.get('div[role="dialog"] input').scrollIntoView().clear().type(search);
});

Cypress.Commands.add("confirmEmailRegExCompatibility", (fieldSelector: string, validEmail: string) => {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var invalid1 = "mdas@";
  var invalid2 = "mffsdfsa@ddd.";
  var invalid3 = "ffdsf.com";
  var inValidLSt = [invalid1, invalid2, invalid3];
  for (var i = 0; i < inValidLSt.length; i++) {
    cy.get(fieldSelector)
      .scrollIntoView()
      .clear()
      .type(inValidLSt[i])
      .invoke("val")
      .then((val) => {
        expect(val).not.to.match(emailRegex);
      });
  }
  cy.get(fieldSelector)
    .scrollIntoView()
    .clear()
    .type(validEmail)
    .invoke("val")
    .then((val) => {
      expect(val).to.match(emailRegex);
    });
}
);

Cypress.Commands.add("prepareBeforeVerifyJournalEntry", (
  transactionCodeIndex: number,
  transactionDateIndex: number,
  journalCodeIndex: number
) => {
  cy.ensurePageIsReady();
  cy.verifyListVIewHasItems();
  cy.contains("button", "Create").scrollIntoView().should("be.visible");
  cy.getCellText("first", journalCodeIndex).then((journalCode) => {
    cy.wrap(journalCode).as("journalCode");
  });
  cy.getCellText("first", transactionCodeIndex).then((code) => {
    cy.wrap(code).as("transactionCode");
  });
  cy.getCellText("first", transactionDateIndex).then((date) => {
    cy.wrap(date).as("dateTxt");
    var mon = date.split("/")[1];
    var year = date.split("/")[2];
    var journalPeriod = mon + "-" + year;
    cy.wrap(date).as("transactionDate");
    cy.wrap(journalPeriod).as("journalPeriod");
  });
});

