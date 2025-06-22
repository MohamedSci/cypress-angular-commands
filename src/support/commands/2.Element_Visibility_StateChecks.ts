declare namespace Cypress {
  interface Chainable<Subject> {
    verifyDimmidInput(attr: string): Chainable<any>;
    verifyDimmidReadOnlyInput(attr: string): Chainable<any>;
    verifyNotDimmidInput(attr: string): Chainable<any>;
    verifyDimmidItemDropDownList(attr: string): Chainable<any>;
    verifyNotExistanceTheRequiredValidation(): Chainable<any>;
    verifyDisplayingTheRequiredValidationMsgsCount(cout: number): Chainable<any>;
    visibilityOfRequiredStar(fieldSelector: string): Chainable<any>;
    checkImageVisibilityBySrc(imgSrc: string): Chainable<any>;
    isSwitchedOn(index: number, isSwitchedOn: boolean): Chainable<any>;
    verifyAfterSavingBehavior(): Chainable<any>;
  }
}


Cypress.Commands.add("verifyDimmidInput", (attr) => {
  cy.getByTestAttribute(attr).then(($input) => {
    cy.softAssertElement($input, "be.disabled", `Input ${attr} should be disabled`);
  });
});

Cypress.Commands.add("verifyDimmidReadOnlyInput", (attr) => {
  cy.getByTestAttribute(attr).then(($input) => {
    cy.softAssertElement($input, "have.attr", "readonly", `Input ${attr} should be readonly`);
    cy.softAssertElement($input, "be.disabled", `Input ${attr} should be disabled`);
  });
});

Cypress.Commands.add("verifyNotDimmidInput", (attr) => {
  cy.getByTestAttribute(attr).then(($input) => {
    cy.softAssertElement($input, "not.have.attr", "readonly", `Input ${attr} should not be readonly`);
    cy.softAssertElement($input, "not.have.attr", "disabled", `Input ${attr} should not be disabled`);
  });
});

// Dropdown list verification
Cypress.Commands.add("verifyDimmidItemDropDownList", (attr) => {
  cy.catchUnCaughtException();
  cy.getByTestAttribute(attr).click({ multiple: true, force: true });
  cy.get('[role="listbox"]').should("not.exist");
});

Cypress.Commands.add("verifyNotExistanceTheRequiredValidation", () => {
  cy.ensurePageIsReady();
  cy.get("span.errorMessage").should("not.exist");
});

Cypress.Commands.add("verifyDisplayingTheRequiredValidationMsgsCount", (cout: number) => {
  cy.get("span.errorMessage").last().scrollIntoView();
  cy.get("span.errorMessage").should("have.length", cout);
}
);

Cypress.Commands.add("visibilityOfRequiredStar", (fieldSelector: string) => {
  cy.get(fieldSelector).should("contain", "*");
});

Cypress.Commands.add("checkImageVisibilityBySrc", (imgSrc) => {
  cy.get("img[src=" + imgSrc + "]").should("be.visible");
});

Cypress.Commands.add("isSwitchedOn", (index: number, isSwitchedOn: boolean) => {
  cy.softAssert(() => {
    cy.get('input[type="checkbox"]')
      .eq(index)
      .scrollIntoView()
      .should("have.attr", "aria-checked", isSwitchedOn ? "true" : "false");
  }, `isSwitchedOn should be  ${isSwitchedOn}`);
});

Cypress.Commands.add("verifyAfterSavingBehavior", () => {
  cy.ensurePageIsReady();
  cy.get('body').then(($body) => {
    const cancelButtons = $body.find('button:contains("Cancel"), button:contains("Back") ');
    cy.wrap(cancelButtons.last()).should('exist').should('be.visible', { timeout: 20000 });
  });
  cy.contains("button", /edit/i, { timeout: 20000 }).scrollIntoView().should("be.visible");
  cy.url().should("include", "view", { timeout: 25000 });
});
