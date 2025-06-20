declare namespace Cypress {
  interface Chainable<Subject> {
    checkAllMultiSelect(multiselectIndex: number, status: boolean): Chainable<any>;
    checkAllMultiSelectDialog(multiselectIndex: number, status: boolean): Chainable<any>;
    selectSpecificOptionFromDropDown(attrName: string, srch: string, optionIndex?: number): Chainable<any>;
    getElementDropDownList(position: string, index: number): Chainable<any>;
    getItemInDropDownList(optionIndex: number | "first" | "last", attrName: string): Chainable<string>;
    closeDropDown(attr: string): Chainable<any>;
    clearMultiSelect(index: number): Chainable<any>;
    selectPrimeNGDropdownOption(dataTestId: string, searchKeyword: string): Chainable<any>;
    selectPrimeNGDropdownByIndex(optionIndex: number | "first" | "last", dataTestId: string): Chainable<string>;
  }
}

Cypress.Commands.add("selectPrimeNGDropdownByIndex", (optionIndex: number | "first" | "last", dataTestId: string) => {
  Cypress.log({
    name: "selectPrimeNGDropdownByIndex",
    displayName: "PrimeNG Dropdown",
    message: `Selecting option '${optionIndex}' from dropdown [data-testid="${dataTestId}"]`,
    consoleProps: () => ({ dataTestId, optionIndex }),
  });

  const dropdownSelector = `p-dropdown[data-testid="${dataTestId}"]`;
  const triggerSelector = `${dropdownSelector} .p-dropdown-label`;
  const panelSelector = ".p-dropdown-panel";
  const itemSelector = ".p-dropdown-item";

  // Step 1: Open the dropdown
  cy.get(triggerSelector)
    .should("exist")
    .scrollIntoView()
    .click({ force: true });

  cy.logMsg(`Opened dropdown [data-testid="${dataTestId}"]`);

  // Step 2: Wait for panel and select option
  return cy.get(panelSelector, { timeout: 15000 })
    .first()
    .scrollIntoView()
    .should("be.visible")
    .find(itemSelector)
    .filter(":visible")
    .then(($options) => {
      const totalOptions = $options.length;

      if (totalOptions === 0) {
        throw new Error(`No visible options found in dropdown [data-testid="${dataTestId}"]`);
      }

      const resolvedIndex =
        optionIndex === "first"
          ? 0
          : optionIndex === "last"
            ? totalOptions - 1
            : typeof optionIndex === "number"
              ? optionIndex
              : (() => {
                throw new Error(
                  `Invalid optionIndex: ${optionIndex}. Use number | "first" | "last"`
                );
              })();

      if (resolvedIndex < 0 || resolvedIndex >= totalOptions) {
        throw new Error(
          `Invalid index '${resolvedIndex}' for dropdown [data-testid="${dataTestId}"], total options: ${totalOptions}`
        );
      }

      const $option = $options.eq(resolvedIndex);
      const selectedText = $option.text().trim();

      cy.wrap($option)
        .should("exist")
        .scrollIntoView()
        .click({ force: true });

      cy.logMsg(
        `Selected option at index ${resolvedIndex} ("${selectedText}") from [data-testid="${dataTestId}"]`
      );

      // Step 3: Wait for panel to close
      cy.get(panelSelector).should("not.exist");

      // Optional: Wait for stability
      cy.ensureStability();

      return cy.wrap(selectedText);
    });
}
);

Cypress.Commands.add("selectPrimeNGDropdownOption", (dataTestId: string, searchKeyword: string) => {
  cy.getByTestAttribute(dataTestId).scrollIntoView().should("be.visible");
  Cypress.log({
    name: "selectPrimeNGDropdownOption",
    displayName: "PrimeNG Dropdown Select",
    message: `Selecting option '${searchKeyword}' from dropdown with data-testid='${dataTestId}'`,
    consoleProps: () => ({ dataTestId, searchKeyword })
  });

  const dropdownSelector = `p-dropdown[data-testid="${dataTestId}"]`;
  const triggerSelector = `${dropdownSelector} .p-dropdown-label`;
  const dropdownPanelSelector = '.p-dropdown-panel';
  const filterInputSelector = 'input.p-dropdown-filter';
  const optionItemSelector = '.p-dropdown-item';

  // Step 1: Open the dropdown
  cy.get(triggerSelector)
    .should('exist')
    .scrollIntoView()
    .click({ force: true });

  cy.logMsg(`Opened dropdown with data-testid='${dataTestId}'`);

  // Step 2: Wait for panel, and type if there's a filter
  cy.get(dropdownPanelSelector)
    .should('exist')
    .scrollIntoView()
    .then($panel => {
      const hasFilter = $panel.find(filterInputSelector).length > 0;
      if (hasFilter) {
        cy.wrap($panel)
          .find(filterInputSelector)
          .should('exist')
          .clear()
          .type(searchKeyword, { delay: 100 });

        cy.logMsg(`Typed '${searchKeyword}' into the dropdown filter`);
      }
    });

  // Step 3: Wait for options to be updated and select the one matching the keyword
  cy.get(dropdownPanelSelector)
    .should('be.visible')
    .find(optionItemSelector)
    .filter(':visible')
    .contains(searchKeyword, { matchCase: false })
    .should('exist')
    .scrollIntoView()
    .click({ force: true });

  cy.logMsg(`Selected the option '${searchKeyword}'`);

  // Step 4: Confirm dropdown panel closes (PrimeNG removes it from DOM)
  cy.get(dropdownPanelSelector).should('not.exist');
  cy.logMsg('Dropdown panel disappeared (selection complete)');

  // Step 5: Ensure stability
  cy.ensureStability();
  cy.logMsg('Page stability confirmed after dropdown selection');
});

Cypress.Commands.add("clearMultiSelect", (index: number) => {
  cy.get('timescircleicon[data-pc-section="clearicon"]')
    .eq(index)
    .scrollIntoView()
    .click({ force: true });
});

Cypress.Commands.add("getElementDropDownList", (position: string, index: number) => {
  cy.catchUnCaughtException();
  cy.get('span[role="combobox"]').eq(index).scrollIntoView();
  cy.get('span[role="combobox"]').eq(index).click({ force: true });
  cy.get('[role="listbox"]').then(($listbox) => {
    if ($listbox.find("li.p-dropdown-empty-message").is(":visible")) {
      cy.get("body").click(0, 0);
      cy.log("getElementDropDownList is empty listbox");
    } else {
      cy.get('li[role="option"]').then(($options) => {
        if ($options.length > 1) {
          var optionIndex = position == "first" ? 0 : $options.length - 1;
          cy.wrap($options)
            .eq(optionIndex)
            .then(($el) => {
              cy.wrap($el).as("el");
              cy.get("@el").click({ force: true });
            });
        }
      });
    }
  });
  cy.get("body").click(0, 0);
}
);

Cypress.Commands.add("closeDropDown", (attr: string) => {
  cy.getByTestAttribute(attr).find("timesicon svg").first().scrollIntoView().click({ force: true });
  cy.ensureStability();
  cy.get("body").click(0, 0);

});

Cypress.Commands.add("clickAdvancedSearchIcon", (index: number) => {
  cy.get("i.search-circle").eq(index).scrollIntoView().click({ force: true });
});

Cypress.Commands.add("checkAllMultiSelect", (multiIndex: number, status: boolean) => {
  // Click the multiselect label to open the dropdown
  cy.get("div.p-multiselect-label")
    .eq(multiIndex)
    .scrollIntoView()
    .click({ force: true });

  // Wait for overlay panel and checkboxes to appear
  cy.get("div.p-checkbox").first().scrollIntoView().then(($checkbox) => {
    if ($checkbox.find('[aria-checked="' + !status + '"]').is(":visible")) {
      cy.wrap($checkbox).click({ force: true });
    }
  });

  cy.get("button.p-multiselect-close").scrollIntoView().click({ force: true });
  // Optionally close dropdown if needed
  cy.get("body").click(0, 0);
}
);

Cypress.Commands.add("checkAllMultiSelectDialog", (multiIndex: number, status: boolean) => {
  cy.get('div[role="dialog"]').within(() => {
    cy.get("div.p-multiselect-label")
      .eq(multiIndex)
      .scrollIntoView()
      .click({ force: true });
  });
  // Wait for overlay panel and checkboxes to appear
  cy.get("div.p-multiselect-header div.p-checkbox", { timeout: 15000 }).first().scrollIntoView().click({ force: true });

  cy.get("div.p-multiselect-header button.p-multiselect-close", { timeout: 15000 }).scrollIntoView().click({ force: true });
  // Optionally close dropdown if needed
  cy.get("body").click(0, 0);
});