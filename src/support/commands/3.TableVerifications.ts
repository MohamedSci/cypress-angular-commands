declare namespace Cypress {
  interface Chainable<Subject> {
    verifyFirstRowHasPostedStatus(): Chainable<any>;
    verifyFirstRowHasUnPostedStatus(): Chainable<any>;
    verifyStatusOfNewTransaction(colIndex: number, status: RegExp): Chainable<any>;
    verifyIntegratedTableLines(tableIndicies: number[], JLTableDetails: string[][]): Chainable<any>;
    increaseScreenItemsMaxCount(count: number): Chainable<any>;
    clickGeneratedTranscationHyperLinkinCellTable(r: number, c: number, module_extension: string, sideIndex: number, module_name: string): Chainable<any>;
    clickFirstGeneratedTranscationHyperLink(hyperLinkSelector: string): Chainable<any>;
    LoopsThroughTableRowsAndProcessesBasedOnCheckboxAttribute(): Chainable<any>;
    deleteAllRowsInTheCostCenterDialog(): Chainable<any>;
    addSalesItemLine(lineIndex: number, quantity: number, discountPercentage: number): Chainable<any>;
    verifyCellInTable(equality: boolean, row: any | "first" | "last", columnIndex: number, expectedValue: string): Chainable<any>;
  }
}

Cypress.Commands.add("verifyCellInTable", (equality: boolean, row: any | "first" | "last", columnIndex: number, expectedValue: string) => {
  let selector: string;
  if (row === "first") {
    selector = `tbody tr:first-child td:nth-child(${columnIndex + 1})`;
  } else if (row === "last") {
    selector = `tbody tr:last-child td:nth-child(${columnIndex + 1})`;
  } else {
    selector = `tbody tr:nth-child(${row + 1}) td:nth-child(${columnIndex + 1
      })`;
  }
  cy.get(selector)
    .first()
    .scrollIntoView()
    .invoke("text")
    .then((txtEx) => {
      const expectedValueC = txtEx.split(" ").join("");
      const actualValueC = expectedValue.split(" ").join("");
      cy.softAssert(() => {
        if (equality) {
          if (
            typeof expectedValue === "number" ||
            !isNaN(parseFloat(actualValueC))
          ) {
            expect(parseFloat(expectedValueC)).to.be.closeTo(
              parseFloat(actualValueC),
              0.001
            );
          } else {
            expect(expectedValueC).to.equal(actualValueC);
          }
        } else {
          if (
            typeof expectedValue === "number" ||
            !isNaN(parseFloat(actualValueC))
          ) {
            expect(parseFloat(expectedValueC)).not.to.be.closeTo(
              parseFloat(actualValueC),
              0.001
            );
          } else {
            expect(expectedValueC).not.to.equal(actualValueC);
          }
        }
      }, `Table cell (${row} row, ${columnIndex} col) should ${equality ? "" : "not "}equal "${expectedValue}"`);
    });
}
);

Cypress.Commands.add("verifyFirstRowHasPostedStatus", () => {
  cy.ensureStability();
  cy.verifyListVIewHasItems();
  cy.get("tbody tr", { timeout: 45000 }).first()
    .scrollIntoView().find("td").last()
    .scrollIntoView().should("exist");
  cy.get("tbody tr", { timeout: 45000 })
    .first()
    .scrollIntoView()
    .within(() => {
      cy.get("td")
        .last()
        .scrollIntoView()
        .within(() => {
          cy.getByTestAttribute("table_button_edit").should("not.exist");
          cy.getByTestAttribute("table_button_delete").should("not.exist");
        });
    });
});

Cypress.Commands.add("verifyFirstRowHasUnPostedStatus", () => {
  cy.get("tbody tr", { timeout: 45000 })
    .first()
    .scrollIntoView()
    .within(() => {
      cy.get("td")
        .last()
        .scrollIntoView()
        .within(() => {
          cy.getByTestAttribute("table_button_edit")
            .scrollIntoView()
            .should("exist");
          cy.getByTestAttribute("table_button_delete")
            .scrollIntoView()
            .should("exist");
        });
    });
});

Cypress.Commands.add("verifyStatusOfNewTransaction", (colIndex: number, status: RegExp) => {
  cy.get("table").should("be.visible");
  cy.get("table").then(($table: any) => {
    if ($table.find("tbody tr").length > 0) {
      cy.wrap($table)
        .find("tbody")
        .find("tr")
        .first()
        .then(($firstRow) => {
          cy.wrap($firstRow)
            .find("td")
            .eq(colIndex)
            .then(($statusCell) => {
              cy.wrap($statusCell)
                .find("p")
                .invoke("text")
                .then((statusText) => {
                  expect(statusText).to.match(status);
                });
            });
        });
    }
  });
}
);

Cypress.Commands.add("verifyIntegratedTableLines", (tableIndicies: number[], tableDetails: string[][]) => {
  cy.get("body").click(0, 0);
  cy.verifyListVIewHasItems();
  cy.get("tbody")
    .find("tr")
    .each(($row, rowIndex) => {
      if (rowIndex < tableDetails.length) {
        tableIndicies.forEach((cellIndex: number, index: number) => {
          cy.wrap($row)
            .find("td")
            .eq(cellIndex)
            .scrollIntoView()
            .invoke("text")
            .then((text) => {
              cy.softAssert(
                () => {
                  expect(
                    text.replace(/\s+/g, " ").trim().toLowerCase()
                  ).to.contain(
                    tableDetails[rowIndex][index]
                      .replace(/\s+/g, " ")
                      .trim()
                      .toLowerCase()
                  );
                },
                `verifyIntegratedTableLines 111 >>> ${text} To contain ${tableDetails[rowIndex][index]}`,
                { subjectAlias: `verifyIntegratedTableLines 222 >>> ${text} To contain ${tableDetails[rowIndex][index]}` }
              );

            });
        });
      }
    });
}
);

Cypress.Commands.add("increaseScreenItemsMaxCount", (count: number) => {
  cy.ensureStability();
  cy.get("table", { timeout: 30000 }).should("be.visible");
  cy.get("body").then(($body) => {
    if ($body.find('span[aria-label="Rows per page"]').last().is(":visible")) {
      cy.wrap($body)
        .find('span[aria-label="Rows per page"]')
        .last()
        .scrollIntoView();
      cy.wrap($body)
        .find('span[aria-label="Rows per page"]')
        .last()
        .click({ force: true });
      cy.wrap($body)
        .find('li[role="option"]')
        .find("span")
        .contains(count.toString())
        .scrollIntoView()
        .should("exist")
        .click({ force: true });
    } else {
      cy.zoomOut();
    }
  });
  cy.ensureStability();
});

Cypress.Commands.add("clickFirstGeneratedTranscationHyperLink",
  (hyperLinkSelector: string) => {
    cy.get(hyperLinkSelector).first().scrollIntoView().click({ force: true });
  }
);

Cypress.Commands.add("clickGeneratedTranscationHyperLinkinCellTable", (
  r: number,
  c: number,
  module_extension: string,
  sideIndex: number,
  module_name: string
) => {
  cy.ensureStability();
  cy.get("tbody").then(($tbody1) => {
    cy.wrap($tbody1)
      .find("tr")
      .eq(r)
      .then(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(c)
          .then(($cell) => {
            cy.wrap($cell)
              .find("p.hyperlink")
              .invoke("removeAttr", "target")
              .click({ force: true });
            cy.wrap($cell)
              .find("p.hyperlink")
              .invoke("text")
              .then((jlCode) => {
                cy.wrap(jlCode).as("jlCode");
                cy.switchingToERPModule(
                  `${Cypress.env("erpBaseUrl")}${module_extension}`,
                  "transactions/" + module_name,
                  sideIndex
                );
              });
          });
      });
  });
  cy.reloadScreen();
  cy.get("@jlCode").then((jlCode) => {
    cy.verifyCellInTable(true, "first", 1, getWrappedString(jlCode));
  });
  cy.clickViewActionButton("first");
  cy.get("table").should("be.visible");
  cy.ensureStability();
  cy.verifyListVIewHasItems();
}
);

Cypress.Commands.add("LoopsThroughTableRowsAndProcessesBasedOnCheckboxAttribute", () => {
  // Arrays to store parent and child texts
  const parents: string[] = [];
  const childs: string[] = [];
  let mapOut = {};
  // Selector for the table
  const tableSelector = "table"; // Adjust the selector to match your table
  // Check if the table is visible
  cy.get(tableSelector)
    .should("exist")
    .within(() => {
      // Get all rows in the table body
      cy.get("tbody tr", { timeout: 20000 }).each(($row) => {
        // Access the fourth column's checkbox
        const checkboxSelector = 'td:nth-child(4) input[type="checkbox"]';
        const secondTdSelector = "td:nth-child(2)";
        cy.wrap($row)
          .find(checkboxSelector)
          .then(($checkbox) => {
            // Get the value of aria-checked attribute
            const isChecked = $checkbox.attr("aria-checked");
            // Get the text in the second column
            cy.wrap($row)
              .find(secondTdSelector)
              .invoke("text")
              .then((text) => {
                const trimmedText = text.trim(); // Trim whitespace
                if (isChecked === "true") {
                  // Add to parents list
                  childs.push(trimmedText);
                } else if (isChecked === "false") {
                  // Add to childs list
                  parents.push(trimmedText);
                }
              });
          });
      });
    })
    .then(() => {
      mapOut = { parents: parents, childs: childs };
      cy.wrap(mapOut).as("mapOut");
    });
}
);

Cypress.Commands.add("deleteAllRowsInTheCostCenterDialog", () => {
  cy.get('div[role="dialog"]', { timeout: 25000 }).scrollIntoView().should("be.visible");
  cy.get('div[role="dialog"] [data-testid="table_button_delete"]', { timeout: 20000 }).each(($row) => {
    cy.wrap($row).scrollIntoView().click({ force: true });
  });
});

Cypress.Commands.add("addSalesItemLine",
  (lineIndex: number, quantity: number, discountPercentage: number) => {
    var lineQuantity = quantity + lineIndex;
    var lineDiscount = discountPercentage + lineIndex * 10;
    cy.ensureStability();
    cy.clickCellInATable(lineIndex, 0); // Item column
    cy.selectPrimeNGDropdownByIndex(lineIndex, "itemId");

    cy.clickCellInATable(lineIndex, 3); // Quantity column
    cy.getByTestAttribute("quantity").scrollIntoView().should("be.visible");
    cy.inputText("quantity", `${lineQuantity}`);

    cy.getCellText(lineIndex, 4).then((priceText) => {
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));

      cy.clickCellInATable(lineIndex, 6); // Discount column
      cy.getByTestAttribute("discountPercentage").scrollIntoView().should("be.visible");
      cy.inputText("discountPercentage", `${lineDiscount}`);
    });
  }
);

const getWrappedString = (x: JQuery<HTMLElement>) => {
  var str = "";
  if (x != null) {
    str = trimTxt(x.toString()).trim();
  }
  return str;
};

const trimTxt = (text: string) => text.replace(/\s/g, "").toString().trim();
