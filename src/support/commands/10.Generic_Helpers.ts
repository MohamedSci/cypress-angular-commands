declare namespace Cypress {
  interface Chainable<Subject> {
    logMsg(str: any): Chainable<any>;
    getByTestAttribute(el: string): Chainable<any>;
    getAllItemsCount(gridSelector: string, itemSelector: string): Chainable<number>;
    hideDialogFooter(): Chainable<any>;
    displayDialogFooter(): Chainable<any>;
    catchUnCaughtException(): Chainable<any>;
  }
}

Cypress.Commands.add("logMsg", (str: any) => {
  cy.log("*****" + str + "*****");
});

Cypress.Commands.add("getAllItemsCount", (gridSelector: string, itemSelector: string) => {
  cy.ensurePageIsReady();
  cy.get("body").then(($body) => {
    if ($body.find(gridSelector).is(":visible")) {
      cy.get(gridSelector).then((parent) => {
        if (parent.find(itemSelector).is(":visible")) {
          cy.get(gridSelector).find(itemSelector).last().scrollIntoView();
          // Get the count of items and return it
          return cy
            .get(gridSelector)
            .find(itemSelector)
            .its("length")
            .then((updatedCount) => {
              return updatedCount; // Return the count directly
            });
        } else {
          cy.log("The Main gridSelector is not visible");
          return 0;
        }
      });
    } else {
      cy.log("The Main gridSelector is not visible");
    }
  });
}
);

Cypress.Commands.add("hideDialogFooter", () => {
  cy.get(".pop_up_footer").invoke("hide");
});

Cypress.Commands.add("displayDialogFooter", () => {
  cy.get(".pop_up_footer").invoke("css", "display", "block");
});

Cypress.Commands.add("getByTestAttribute", (el: string) => {
  return cy.get("[data-testid=" + el + "]", { timeout: 30000 });
});

Cypress.Commands.add("catchUnCaughtException", () => {
  // Catch uncaught exceptions specific to the "children" error
  Cypress.on("uncaught:exception", (err) => {
    if (
      err.message.includes(
        "Cannot read properties of null (reading 'children')"
      )
    ) {
      return false;
    }
    return true;
  });
});
