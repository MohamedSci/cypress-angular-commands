declare namespace Cypress {
  interface Chainable<Subject> {
    verifySearchFunctionality(searchSelector: string, columnIndices: number[]): Chainable<any>;
    selectAllStatusExceptPostFilter(statusSelector: string, PostedIndex: number): Chainable<any>;
    selectPostFilter(statusSelector: string, postedIndex: number): Chainable<any>;
    getCellValueWhenCondition(targetCol: number, conditionCol: number, conditionValue: string): Chainable<any>;
  }
}

Cypress.Commands.add("verifySearchFunctionality", (searchSelector: string, columnIndices: number[]) => {
  cy.ensureStability();
  cy.verifyListVIewHasItems();
  columnIndices.forEach((columnIndex: number) => {
    cy.get("tbody tr", { timeout: 45000 }).then(($rows) => {
      if ($rows.length > 1) {
        // Test with the last cell value
        cy.getCellText("last", columnIndex).then((lastCellValue) => {
          if (lastCellValue) {
            cy.get(searchSelector)
              .scrollIntoView()
              .clear({ force: true })
              .type(lastCellValue, { force: true });
            cy.ensureStability();
            cy.verifyCellInTable(true, 0, columnIndex, lastCellValue);

          }
        });
        cy.reloadScreen();
        // Test with a middle cell value (more robust against duplicate first/last)
        if ($rows.length > 2) {
          const middleRowIndex = Math.floor($rows.length / 2) - 1; // Calculate middle row, accounting for 0-indexing
          cy.getCellText(middleRowIndex, columnIndex).then(
            (middleCellValue) => {
              if (middleCellValue) {
                cy.get(searchSelector).clear({ force: true }).type(middleCellValue, { force: true });
                cy.wait(750 * (columnIndex + 1));
                cy.get("tbody tr:first-child").should(
                  "contain",
                  middleCellValue
                );
              }
            }
          );
          cy.reloadScreen();
        }
      } else {
        cy.log("There are not enough visible rows in the table.");
      }
    });
  });
});

Cypress.Commands.add("selectAllStatusExceptPostFilter", (statusSelector: string, PostedIndex: number) => {
  cy.getByTestAttribute(statusSelector).scrollIntoView().click();
  cy.get("div.p-checkbox-box", { timeout: 30000 }).eq(0).scrollIntoView().click();
  cy.get("div.p-checkbox-box").eq(PostedIndex).scrollIntoView().click();
  cy.clickButton(/view/i);
  cy.get("body").click(0, 0); // Click outside to close the dropdown
  cy.ensureStability();
}
);

Cypress.Commands.add("selectPostFilter", (statusSelector: string, postedIndex: number) => {
  cy.getByTestAttribute(statusSelector).scrollIntoView().click();
  cy.get("div.p-checkbox-box", { timeout: 30000 }).eq(postedIndex).scrollIntoView().click();
  cy.clickButton(/view/i);
  cy.get("body").click(0, 0); // Click outside to close the dropdown
  cy.ensureStability();
});

Cypress.Commands.add("getCellValueWhenCondition",(targetCol: number, conditionCol: number, conditionValue: string) => {
    cy.ensureStability();

    // Validate input parameters
    if (targetCol < 0 || conditionCol < 0 || !conditionValue) {
      throw new Error("Invalid input for getCellValueWhenCondition.");
    }

    cy.get("table").should("be.visible");

    cy.get("table tbody tr:visible").then(($rows) => {
      if (!$rows.length) {
        throw new Error("No visible rows found in table.");
      }

      let valueFound = false;

      cy.wrap($rows).each(($row, index, $rowList) => {
        if (valueFound) return;

        cy.wrap($row)
          .find("td")
          .eq(conditionCol)
          .invoke("text")
          .then((conditionText) => {
            if (conditionText.trim().includes(conditionValue)) {
              cy.wrap($row)
                .find("td")
                .eq(targetCol)
                .invoke("text")
                .then((targetText) => {
                  cy.log(`Matched Row: ${index}, Target Value: ${targetText.trim()}`);
                  cy.wrap(targetText.trim()).as("firstColumnText");
                  valueFound = true; // prevent further iteration
                });
            }
          });
      }).then(() => {
        if (!valueFound) {
          throw new Error(`No row found with "${conditionValue}" in column ${conditionCol}.`);
        }
      });

    });

    cy.ensureStability();
  }
);

