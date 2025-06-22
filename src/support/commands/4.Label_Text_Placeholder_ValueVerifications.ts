
declare namespace Cypress {
  interface Chainable<Subject> {
    verifyTextValue(attr: string, str: string): Chainable<any>;
    verifyLabelMapping(labelMappings: any): Chainable<any>;
    verifyElementsValues(selector: string, labels: any[]): Chainable<any>;
    verifyManyTextsBySelector(selector: string, labels: any[]): Chainable<any>;
    verifyLabelText(forAttr: string, txt: any): Chainable<any>;
    verifyTestAttributeLabelText(testAttr: string, txt: any): Chainable<any>;
    verifyCalenderLabel(date: string): Chainable<any>;
    verifyElementValueMapping(selctorList: string[], values: any[]): Chainable<any>;
    verifyTableHeadersScreen(headers: string[]): Chainable<any>;
    verifyParagraphHeaders(headers: string[]): Chainable<any>;
    verifyPlaceholderValueAttr(attr: string, index: number, txt: string): Chainable<string>;
    verifyManyViaPlaceholderValues(selector: string, labels: any[]): Chainable<any>;
    getPlaceholderValueAttr(attr: string, index: number): Chainable<string>;
    verifyIntegratedPostedJournalEntrySectionHeaders(JLSectionLabelsList: string[], JLSectionValuesList: string[]): Chainable<any>;
    verifyFieldValue(attrName: string, txtEx: string): Chainable<any>;
  }
}

Cypress.Commands.add("verifyIntegratedPostedJournalEntrySectionHeaders", (JLSectionLabelsList: string[], JLSectionValuesList: string[]) => {
  Cypress.log({
    name: "verifyIntegratedPostedJournalEntrySectionHeaders",
    displayName: "Verify Journal Entry Sections",
    message: "Verifying section headers and values in Journal Entry."
  });

  // Get the main grid element once
  cy.get('div[class="grid"]')
    .should('be.visible') // Ensure the grid is visible before proceeding
    .then(($grid) => {
      cy.logMsg("Main Journal Entry grid is visible.");

      // --- Step 1: Verify Section Headers (Labels) ---
      // Find all label elements within the grid
      cy.wrap($grid)
        .find("p.headsCont")
        .should('have.length.at.least', 1) // Ensure at least one header is found
        .each(($headsCont, index) => {
          // Ensure the expected list has a corresponding entry
          if (index >= JLSectionLabelsList.length) {
            cy.logMsg(
              `Warning: More 'p.headsCont' elements found (${index + 1}) than expected labels in JLSectionLabelsList (${JLSectionLabelsList.length}).`

            );
            return; // Skip assertion for this element if no corresponding expected label
          }

          cy.wrap($headsCont)
            .scrollIntoView() // Scroll each header into view
            .invoke("text")
            .then((text) => {
              const cleanedActualText = text.replace(/\u00a0/g, " ").trim().toLowerCase();
              const expectedLabel = String(JLSectionLabelsList[index]).toLowerCase(); // Ensure expected label is a string

              cy.logMsg(`Comparing Label [${index}]: Actual='${cleanedActualText}' Expected='${expectedLabel}'`);
              expect(cleanedActualText).to.contain(expectedLabel); // Using 'contain' as per original logic

              cy.logMsg(`Label '${expectedLabel}' verified successfully.`);
            });
        });

      // --- Step 2: Verify Section Values (Sub-Heads) ---
      // Find all value elements within the grid
      cy.wrap($grid)
        .find("p.subHead")
        .should('have.length.at.least', 1) // Ensure at least one subHead is found
        .each(($subHead, index) => {
          // Ensure the expected list has a corresponding entry
          if (index >= JLSectionValuesList.length) {
            cy.logMsg(
              `Warning: More 'p.subHead' elements found (${index + 1}) than expected values in JLSectionValuesList (${JLSectionValuesList.length}).`
            );
            return; // Skip assertion for this element if no corresponding expected value
          }

          cy.wrap($subHead)
            .scrollIntoView() // Scroll each value into view
            .invoke("text")
            .then((text) => {
              const cleanedActualValueText = text?.toString().replace(/\u00a0/g, " ").trim().toLowerCase();
              // FIX for TypeError: JLSectionValuesList[i].toLowerCase is not a function
              // Ensure JLSectionValuesList[index] is treated as a string before calling toLowerCase()
              const expectedValue = String(JLSectionValuesList[index]).toLowerCase();

              cy.logMsg(`Comparing Value [${index}]: Actual='${cleanedActualValueText}' Expected='${expectedValue}'`);
              expect(expectedValue).to.contain(cleanedActualValueText); // Original order was expected.to.contain(actual)

              // Additionally, check for 'N/A' as per your original first().should('not.contain', 'N/A');
              // This check is now applied to ALL subHead elements, not just the first.
              expect(cleanedActualValueText).to.not.equal("n/a"); // Use 'equal' for exact match of "n/a"

              cy.logMsg(`Value '${expectedValue}' verified successfully.`);
            });
        });

      cy.logMsg("All Journal Entry sections (labels and values) verified successfully.");
    });
}
);

Cypress.Commands.add("verifyTextValue", (attr: string, str: string) => {
  cy.getByTestAttribute(attr)
    .as(`field-${attr}`)
    .invoke("val")
    .then((actualValue) => {
      cy.softAssert(
        (val: string) => {
          expect(removeSpacesBetween(val)).to.include(removeSpacesBetween(str));
          return val; // Return value for actual in results
        },
        `Field "${attr}" should contain "${str}"`,
        {
          expected: str,
          subjectAlias: `Field ${attr}`,
        }
      );
    });
});

Cypress.Commands.add("verifyLabelMapping", (labelMappings: Map<String, any>) => {
  labelMappings.forEach(({ label, text }) => {
    cy.contains(`[data-testid="${label}"]`, new RegExp(text, "i")).scrollIntoView().scrollIntoView().should("be.visible");
  });
}
);

Cypress.Commands.add("verifyElementsValues", (selector: string, labels: any[]) => {
  labels.forEach((label, index) => {
    cy.softAssert(
      () =>
        cy.get(selector)
          .eq(index)
          .invoke("text")
          .then((elementTxt) => {
            expect(elementTxt.toLowerCase()).to.contain(label.toLowerCase());
          }),
      `verifyElementsValues ${selector} should contain "${label}"`,
      { subjectAlias: `${selector} should contain "${label}"` }
    );
  });
});

Cypress.Commands.add("verifyCalenderLabel", (date: string) => {
  cy.get(".p-calendar > .p-inputtext")
    .should("have.value", date)
    .and("be.visible")
    .and("be.enabled");
});

Cypress.Commands.add("verifyElementValueMapping", (selctorList: string[], values: any[]) => {
  selctorList.forEach((selector, index) => {
    cy.contains(selector, values[index])
      .scrollIntoView()
      .should("be.visible");
  });
}
);

Cypress.Commands.add("verifyTableHeadersScreen", (headers: string[]) => {
  cy.ensurePageIsReady();
  cy.get("table").should("be.visible");
  cy.get("thead th").should("have.length.greaterThan", 2);
  headers.forEach((expectedHeader, index) => {
    cy.get("thead")
      .find("th")
      .eq(index)
      .scrollIntoView()
      .invoke("text")
      .then((actualHeader) => {
        const actualNormalizedHeaderText = actualHeader
          .replace(/\s+/g, " ")
          .trim().toLowerCase(); // Normalize whitespace;
        expect(actualNormalizedHeaderText).to.contain(expectedHeader.trim().toLowerCase()
        );
      });
  });
});

Cypress.Commands.add("verifyPlaceholderValueAttr", (attr: string, index: number, txt: string) => {
  cy.getByTestAttribute(attr)
    .eq(index)
    .scrollIntoView()
    .should("exist")
    .invoke("attr", "placeholder")
    .then((placeholderText) => {
      expect(placeholderText).to.exist; // Check if the placeholder exists
      expect(removeSpacesBetween(placeholderText)).to.include(
        removeSpacesBetween(txt)
      );
    });
});

Cypress.Commands.add("getPlaceholderValueAttr", (attr: string, index: number) => {
  cy.getByTestAttribute(attr)
    .eq(index)
    .scrollIntoView()
    .should("exist")
    .invoke("attr", "placeholder")
    .then((placeholderText) => {
      expect(placeholderText).to.exist; // Check if the placeholder exists
      cy.wrap(placeholderText); // Wrap and return the placeholder text
    });
}
);

Cypress.Commands.add("verifyLabelText", (forAttr: string, txt: any) => {
  cy.get("label[for=" + forAttr + "]")
    .scrollIntoView()
    .should("include", txt);
});

Cypress.Commands.add("verifyTestAttributeLabelText", (testAttr: string, txt: any) => {
  cy.getByTestAttribute(testAttr).scrollIntoView().should("include", txt);
}
);

Cypress.Commands.add("verifyManyViaPlaceholderValues", (selector: string, labels: any[]) => {
  labels.forEach((label, index) => {
    cy.get(selector)
      .eq(index)
      .scrollIntoView()
      .should("exist")
      .invoke("attr", "placeholder")
      .then((placeholderText) => {
        expect(placeholderText).to.exist; // Check if the placeholder exists
        expect(removeSpacesBetween(placeholderText)).to.include(
          removeSpacesBetween(label)
        );
      });
  });
});

Cypress.Commands.add("verifyManyTextsBySelector", (selector: string, labels: any[]) => {
  labels.forEach((label, index) => {
    cy.get(selector).contains(label).scrollIntoView().should("be.visible");
  });
}
);

Cypress.Commands.add("verifyParagraphHeaders", (paragraphHeaders: string[]) => {
  paragraphHeaders.forEach((header) => {
    cy.get("p.p-0.m-0").contains(header).should("be.visible");
  });
});

Cypress.Commands.add("verifyFieldValue", (attrName: string, txtEx: string) => {
  cy.getByTestAttribute(attrName)
    .invoke("val")
    .then((txt) => {
      const expectedValueC = removeSpacesBetween(
        txtEx.replace(".0", "").replace(",", "")
      );
      const actualValueC = removeSpacesBetween(txt.replace(".0", "").replace(",", ""));
      cy.softAssertValue(actualValueC, expectedValueC, `Field ${attrName} should equal "${txtEx}"`);
    });
});


function removeSpacesBetween(word: any): string {
  return word.split(" ").join("");
}