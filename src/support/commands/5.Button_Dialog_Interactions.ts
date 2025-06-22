declare namespace Cypress {
  interface Chainable<Subject> {
    verifyDialogCancelButton(): Chainable<any>;
    verifyCancelButton(): Chainable<any>;
    verifyPostButton(): Chainable<any>;
    verifyPopUp(isSuccessProcess: boolean): Chainable<any>;
    clickAddNewLineInDialog(): Chainable<any>;
    clickViewActionButton(position: string): Chainable<any>;
    clickPostActionButton(position: string): Chainable<any>;
    clickDeleteActionButton(position: string): Chainable<any>;
    clickDeleteActionIconButton(position: string): Chainable<any>;
    confirmDeletePopUp(isDeleted: boolean, apiExtension: string): Chainable<any>;
    clickEditActionIconButton(position: string): Chainable<any>;
    clickEditActionButton(position: string): Chainable<any>;
    clickDialogSaveButton(): Chainable<any>;
    clickDialogCancelButton(): Chainable<any>;
    clickButton(btnLabel: RegExp): Chainable<any>;
    clickAdvancedSearchIcon(index: number): Chainable<any>;
    selectNewCalenderDate(dataTestId: string, index: number): Chainable<any>;
    addCostCenter(costCenter: string, row: number, col: number): Chainable<any>;
    confirmTheDialog(): Chainable<any>;
    cancelTheDialog(): Chainable<any>;
    clickButtonWithDataTestId(partialId: string, index: number): Chainable<any>;
    toggleInputSwitch(selector: string, orderIndex: number, desiredState: 'on' | 'off'): Chainable<void>;
    clickSkipButtonWhenVisible(): Chainable<any>;
  }
}
Cypress.Commands.add("selectNewCalenderDate", (dataTestId: string, index: number) => {
  Cypress.log({
    name: "selectLastDayFromCalendar",
    displayName: "PrimeNG Calendar Select",
    message: `Selecting the last valid day from calendar with data-testid='${dataTestId}'`,
    consoleProps: () => ({ dataTestId })
  });

  const calendarSelector = `p-calendar[data-testid="${dataTestId}"]`;
  const triggerButtonSelector = `${calendarSelector} .p-datepicker-trigger`;
  const datePickerPanelSelector = 'div.p-datepicker'; // Panel appears in DOM
  const dayCellSelector = '.p-datepicker-calendar td:not(.p-disabled)'; // Enabled day cells only

  // Step 1: Click the trigger button to open the calendar
  cy.get(triggerButtonSelector)
    .eq(index)
    .should('exist')
    .scrollIntoView()
    .click({ force: true });

  cy.logMsg(`Opened calendar with data-testid='${dataTestId}'`);

  // Step 2: Wait for the calendar panel to be visible
  cy.get(datePickerPanelSelector)
    .should('be.visible');

  // Step 3: Find all enabled day cells and click the one with the highest number
  cy.get(datePickerPanelSelector)
    .find(dayCellSelector)
    .then($days => {
      const dayTexts = [...$days].map(el => parseInt(el.innerText)).filter(n => !isNaN(n));
      const maxDay = Math.max(...dayTexts);

      cy.wrap($days)
        .contains(new RegExp(`^${maxDay}$`)) // Exact match
        .should('be.visible')
        .scrollIntoView()
        .click({ force: true });

      cy.logMsg(`Selected the last valid day of the month: ${maxDay}`);
    });

  // Step 4: Wait for the calendar to close
  cy.get(datePickerPanelSelector).should('not.exist');

  cy.ensurePageIsReady();
  cy.logMsg(`Calendar interaction completed for '${dataTestId}'`);
});


Cypress.Commands.add("clickSkipButtonWhenVisible", () => {
  cy.ensurePageIsReady();
  cy.get("body").then(($body) => {
    if ($body.find(".skip-button").length > 0) {
      cy.get(".skip-button").first().scrollIntoView().click({ force: true });
    }
  });
  cy.ensurePageIsReady();
});

Cypress.Commands.add("clickButton", (btnLabel: RegExp) => {
  cy.contains("button", btnLabel, { timeout: 30000 }).scrollIntoView().click({ force: true });
  cy.ensurePageIsReady();
});

Cypress.Commands.add("verifyPopUp", (isSuccessProcess: boolean) => {
  const type = isSuccessProcess ? "Success" : "Error";
  const summarySelector = `div.p-toast-summary:contains(${type})`;

  cy.get(summarySelector, { timeout: 30000 }).last().as(`${type.toLowerCase()}-toast`).scrollIntoView();

  cy.softAssert(
    (el: JQuery) => expect(el).to.be.visible,
    `${type} toast should be visible`,
    { subjectAlias: `${type} toast` }
  );

  cy.get("div.p-toast-detail").last().as("toast-detail").scrollIntoView();

  cy.softAssert(
    (el: JQuery) => expect(el).to.be.visible,
    `${type} toast detail should be visible`,
    { subjectAlias: `${type} toast detail` }
  );
});

Cypress.Commands.add("clickAddNewLineInDialog", () => {
  cy.contains('div[role="dialog"] button', /Add/i).scrollIntoView().click({ force: true })
});

Cypress.Commands.add("clickViewActionButton", (position: string) => {
  cy.ensurePageIsReady();
  cy.verifyListVIewHasItems();
  cy.catchUnCaughtException();
  cy.increaseScreenItemsMaxCount(100);
  cy.zoomOut();
  if (position == "first") {
    cy.getByTestAttribute("table_button_view").first().click({ force: true });
  } else {
    cy.getByTestAttribute("table_button_view").last().click({ force: true });
  }
  cy.ensurePageIsReady();
});

Cypress.Commands.add("clickPostActionButton", (position: string) => {
  cy.ensurePageIsReady();
  cy.verifyListVIewHasItems();
  cy.catchUnCaughtException();
  cy.increaseScreenItemsMaxCount(100);
  cy.zoomOut();
  if (position == "first") {
    cy.getByTestAttribute("table_button_post").first().click({ force: true });
  } else {
    cy.getByTestAttribute("table_button_post").last().click({ force: true });
  }
  cy.ensurePageIsReady();
});

Cypress.Commands.add("clickDeleteActionButton", (position: string) => {
  cy.ensurePageIsReady();
  cy.verifyListVIewHasItems();
  cy.catchUnCaughtException();
  cy.increaseScreenItemsMaxCount(100);
  cy.zoomOut();
  cy.ensurePageIsReady();
  // Check for table existence
  if (position == "first") {
    cy.getByTestAttribute("table_button_delete").first().click({ force: true });
  } else {
    cy.getByTestAttribute("table_button_delete").last().click({ force: true });
  }
  cy.ensurePageIsReady();
  cy.logMsg("Delete Action Button Clicked");
});

Cypress.Commands.add("clickDeleteActionIconButton", (position: string) => {
  cy.ensurePageIsReady(); // Wait for network requests to complete
  cy.ensurePageIsReady();       // Wait for the page to become stable
  cy.catchUnCaughtException(); // Assuming this is a custom command for handling exceptions
  cy.increaseScreenItemsMaxCount(100); // Ensure maximum items are displayed, making the element more likely to be on screen
  cy.zoomOut(); // Zoom out to ensure elements are not obscured or off-screen

  position == "first" ?
    cy.get('img[src*="delet"]', { timeout: 30000 })
      .first()
      .scrollIntoView()
      .click({ force: true }) :
    cy.get('img[src*="delet"]', { timeout: 30000 })
      .last()
      .scrollIntoView()
      .click({ force: true });
});

Cypress.Commands.add("confirmDeletePopUp", (isDeleted: boolean, apiExtension: string) => {
  // Only match the path and method (GET), ignore query params
  cy.intercept('DELETE', new RegExp(`${apiExtension}`, 'i')).as(`delete`);
  // Confirm delete action
  cy.get('div[role="dialog"]')
    .should("be.visible")
    .within(() => {
      cy.get("button.swal2-confirm").scrollIntoView().click({ force: true });
    });
  cy.ensurePageIsReady();
  cy.wait(`@delete`, { timeout: 20000 }).its('response.statusCode').should('eq', isDeleted ? 200 : 500);
});

Cypress.Commands.add("clickEditActionIconButton", (position: string) => {
  cy.ensurePageIsReady();
  if (position == "first") {
    cy.get('img[src="assets/images/table/edit.svg"]', { timeout: 30000 })
      .first()
      .scrollIntoView()
      .click({ force: true });
  } else {
    cy.get('img[src="assets/images/table/edit.svg"]', { timeout: 30000 })
      .last()
      .scrollIntoView()
      .click({ force: true });
  }
  cy.ensurePageIsReady();
});

Cypress.Commands.add("clickEditActionButton", (position: string) => {
  cy.ensurePageIsReady();
  cy.verifyListVIewHasItems();
  if (position == "first") {
    cy.getByTestAttribute("table_button_edit").first().scrollIntoView().click({ force: true });
  } else {
    cy.getByTestAttribute("table_button_edit").last().scrollIntoView().click({ force: true });
  }
  cy.ensurePageIsReady();
});

Cypress.Commands.add("verifyCancelButton", () => {
  cy.getByTestAttribute("cancel")
    .scrollIntoView()
    .should("be.visible");
});

Cypress.Commands.add("clickDialogSaveButton", () => {
  cy.contains('div[role="dialog"] button', /save/i, { timeout: 30000 })
    .last()
    .scrollIntoView()
    .click({ force: true });
  cy.logMsg("Dialog Save Button Clicked");
  cy.ensurePageIsReady();
});

Cypress.Commands.add("verifyDialogCancelButton", () => {
  cy.contains('div[role="dialog"] button', /cancel/i, { timeout: 30000 })
    .scrollIntoView()
    .should("be.visible");
  cy.logMsg("Dialog Save Button Visible");
  cy.ensurePageIsReady();
});

Cypress.Commands.add("clickDialogCancelButton", () => {
  cy.get('div[role="dialog"]', { timeout: 30000 }).within(() => {
    cy.getByTestAttribute("cancel").last().scrollIntoView().click({ force: true });
  });
  cy.ensurePageIsReady();
});

Cypress.Commands.add("verifyPostButton", () => {
  [/back/i, /Edit/i, /Post/i].forEach((title) => {
    cy.contains("button", title).scrollIntoView().should("be.visible").and("not.be.disabled");
  });
});

Cypress.Commands.add("toggleInputSwitch", (selector: string, orderIndex: number, desiredState: 'on' | 'off') => {
  cy.get(selector, { timeout: 30000 }).eq(orderIndex).as('inputSwitchComponent'); // Alias the main component for readability and reusability

  cy.get('@inputSwitchComponent').then(($switch) => {
    // Determine the current state by checking the 'p-inputswitch-checked' class on the inner div
    // This class indicates whether the switch is currently "on"
    const isCurrentlyOn = $switch.find('.p-inputswitch').hasClass('p-inputswitch-checked');
    const shouldBeOn = desiredState === 'on';

    if (isCurrentlyOn === shouldBeOn) {
      // The switch is already in the desired state, so no action is needed.
      cy.log(`Input Switch at '${selector}' is already ${desiredState}. No action needed.`);
    } else {
      // The switch needs to be toggled. Click the slider.
      cy.log(`Toggling Input Switch at '${selector}' from ${isCurrentlyOn ? 'on' : 'off'} to ${desiredState}.`);

      cy.wrap($switch).find('.p-inputswitch-slider')
        .scrollIntoView() // Ensure the slider is visible in the viewport
        .click({ force: true });         // Click the slider to change its state

      // Assert that the state has changed correctly after the click
      cy.get('@inputSwitchComponent').find('.p-inputswitch').should(($innerDiv) => {
        if (shouldBeOn) {
          expect($innerDiv).to.have.class('p-inputswitch-checked');
        } else {
          expect($innerDiv).to.not.have.class('p-inputswitch-checked');
        }
      }).log(`Input Switch at '${selector}' successfully toggled to ${desiredState}.`);
    }
  });
});

Cypress.Commands.add("addCostCenter", (costCenter: string, row: number, col: number) => {
  cy.clickCellInATable(row, col);
  cy.get("tbody tr", { timeout: 20000 }).eq(row).find("td").eq(col).find("img").scrollIntoView().click({ force: true });
  cy.ensurePageIsReady();
  cy.deleteAllRowsInTheCostCenterDialog();
  cy.clickAddNewLineInDialog();
  // cy.get('div[role="dialog"]').scrollIntoView().should("be.visible").within(() => {
  cy.selectPrimeNGDropdownOption("costCenterId", costCenter);
  cy.get("timesicon svg").last().scrollIntoView().click({ force: true });
  cy.selectPrimeNGDropdownOption("costCenterId", costCenter);
  cy.getByTestAttribute("percentage")
    .last()
    .scrollIntoView()
    .clear()
    .type("100");
  // });
  cy.clickDialogSaveButton();
   cy.ensurePageIsReady();
});

Cypress.Commands.add("confirmTheDialog", () => {
  cy.get('button.swal2-confirm', { timeout: 15000 }).scrollIntoView().click({ force: true });
  cy.ensurePageIsReady();
  cy.get("body").click(0, 0); // Close any open dropdowns or dialogs
});

Cypress.Commands.add("cancelTheDialog", () => {
  cy.get('button.swal2-cancel', { timeout: 20000 }).scrollIntoView().click({ force: true });
  cy.ensurePageIsReady();
  cy.get("body").click(0, 0); // Close any open dropdowns or dialogs
});

Cypress.Commands.add('clickButtonWithDataTestId', (partialId: string, index: number) => {
  cy.get(`button[data-testid*="${partialId}"]`, { timeout: 30000 }).eq(index).scrollIntoView().click({ force: true });
});
