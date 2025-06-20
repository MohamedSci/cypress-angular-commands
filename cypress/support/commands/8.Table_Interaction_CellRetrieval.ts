

declare namespace Cypress {
  interface Chainable<Subject> {
    getCellText(row: number | "first" | "last", columnIndex: number): Chainable<string>;
    sortItemsInAColumn(colIndex: number, behavior: string): Chainable<any>;
    exportListView(apiExtension: string, type: string): Chainable<void>;
    clickCellInATable(row: number | "first" | "last", columnIndex: number): Chainable<void>;
  }
}

Cypress.Commands.add('exportListView', (apiExtension: string, type: string) => {
  cy.ensureStability(); // Ensure the page is stable before starting the export
  const exportType = type.toLowerCase(); // "excel" or "pdf"
  cy.ensureStability(); // Ensure the page is stable before starting the export

  // Only match the path and method (GET), ignore query params
  cy.intercept('GET', new RegExp(`${apiExtension}/Export`, 'i')).as(`export${exportType}`);
  // Click to open the export menu
  cy.get('button.export', { timeout: 15000 }).scrollIntoView().click({ force: true });
  cy.get('div.p-menuitem-content', { timeout: 15000 }).should("have.length.greaterThan", 1); // Ensure there are two export options
  // Click on Excel (0) or PDF (1) based on type
  cy.get('div.p-menuitem-content').eq(exportType === 'excel' ? 0 : 1).scrollIntoView().click();
  // Wait for the intercepted request
  cy.wait(`@export${exportType}`, { timeout: 20000 }).its('response.statusCode').should('eq', 200);
});

Cypress.Commands.add("clickCellInATable", (
  row: number | "first" | "last",
  columnIndex: number, // Expected to be 0-indexed (e.g., 0 for the first column)
  tableSelector: string = 'table' // Optional: CSS selector for the specific table, defaults to 'table'
) => {
  cy.log(`Cypress Command "clickCellInATable" invoked with:${row}`);
  // --- Input Validation ---
  if (typeof row === 'number' && row < 0) {
    throw new Error(`Cypress Command "clickCellInATable": Invalid row index "${row}". 
                     Row must be a non-negative number (0-indexed), "first", or "last".`);
  }
  if (columnIndex < 0) {
    throw new Error(`Cypress Command "clickCellInATable": Invalid columnIndex "${columnIndex}". 
                     Column index must be a non-negative number (0-indexed).`);
  }

  // --- Determine Row Selector ---
  let rowSelector: string;
  if (row === "first") {
    rowSelector = 'tr:first-child';
  } else if (row === "last") {
    rowSelector = 'tr:last-child';
  } else {
    // Convert 0-indexed 'row' number to 1-indexed for CSS nth-child()
    rowSelector = `tr:nth-child(${row + 1})`;
  }

  // --- Convert Column Index ---
  // Convert 0-indexed 'columnIndex' to 1-indexed for CSS nth-child()
  const cssColumnIndex = columnIndex + 1;

  // --- Locate and Click the Cell ---
  cy.log(`Attempting to click cell: Table='${tableSelector}', Row='${row}', Column Index='${columnIndex}'`);

  cy.get(tableSelector)
    .find('tbody') // Always good practice to explicitly target tbody for row selection
    .find(rowSelector) // Find the specific row
    .find(`td:nth-child(${cssColumnIndex})`) // Find the specific cell (td) within that row
    .scrollIntoView() // Ensure the element is visible in the viewport
    .click({ force: true }); // Click it, force: true bypasses some actionability checks
});

Cypress.Commands.add("getCellText", (row: number | "first" | "last", columnIndex: number) => {
  let selector: string;
  if (row === "first") {
    selector = `tbody tr:first-child td:nth-child(${columnIndex + 1})`;
  } else if (row === "last") {
    selector = `tbody tr:last-child td:nth-child(${columnIndex + 1})`;
  } else {
    selector = `tbody tr:nth-child(${row + 1}) td:nth-child(${columnIndex + 1
      })`;
  }
  return cy.get(selector)
    .first()
    .scrollIntoView()
    .invoke("text")
    .then((text) => text.trim());
} 
);