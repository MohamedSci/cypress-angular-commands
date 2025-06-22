declare namespace Cypress {
    interface Chainable<Subject> {
        verifyListVIewHasItems(): Chainable<any>;
        getInitItemsCountInListView(): Chainable<any>;
        assertNewItemAddedToListView(): Chainable<any>;
        assertAfterItemEditedInListView(): Chainable<any>;
        assertItemDeletedFromListView(): Chainable<any>;
        verifyEditDeleteButtonsNotExistanceWhenPostedStatus(): Chainable<any>;
        goToLastPaginatorPage(): Chainable<any>;
    }
}

Cypress.Commands.add("goToLastPaginatorPage", () => {
    cy.get("body").then(($body) => {
        if ($body.find("lib-table-paginator").length > 0) {
            cy.get("lib-table-paginator").then(($libTablePaginator) => {
                if ($libTablePaginator.find('button[aria-label="Last Page"]').is(":disabled")) {
                    cy.logMsg("List view is fully loaded, no pagination available.");
                } else {
                    cy.get('button[aria-label="Last Page"]', { timeout: 20000 }).scrollIntoView().click({ force: true });
                    cy.ensurePageIsReady();
                    cy.get("tbody tr", { timeout: 10000 }).should("have.length.greaterThan", 0);
                }
            });
        } else {
            cy.get("tbody tr", { timeout: 30000 }).should("have.length.greaterThan", 0);
        }
    });
    cy.get("tbody tr", { timeout: 30000 }).last().scrollIntoView().should("be.visible");
});

Cypress.Commands.add("verifyListVIewHasItems", () => {
    cy.softAssert(
        () => cy.get("tbody tr", { timeout: 10000 }).should("have.length.greaterThan", 0),
        `get Initial Items Count In ListView`,
        { subjectAlias: `getInitItemsCountInListView` }
    );
});

Cypress.Commands.add("getInitItemsCountInListView", () => {
    cy.ensurePageIsReady();
    cy.verifyListVIewHasItems();
    cy.increaseScreenItemsMaxCount(100);
    cy.goToLastPaginatorPage();
    cy.getAllItemsCount("table", "tbody tr").then((initCount) => {
        cy.wrap(initCount).as("initCount");
    });
    cy.ensurePageIsReady();
});

Cypress.Commands.add("assertNewItemAddedToListView", () => {
    cy.url().should("not.include", "view"), { timeout: 120000 };
    cy.ensurePageIsReady();
    cy.increaseScreenItemsMaxCount(100);
    cy.goToLastPaginatorPage();
    cy.get("@initCount").then((initCount) => {
        cy.getAllItemsCount("table", "tbody tr").then((finalCount) => {
            var initialNo = [100, 101].includes(getWrappedNumber(initCount)) && finalCount == 1 ? 0 : getWrappedNumber(initCount);
            expect(finalCount).to.equal(initialNo + 1);
        });
    });
});

Cypress.Commands.add("assertAfterItemEditedInListView", () => {
    cy.url().should("not.include", "view"), { timeout: 120000 };
    cy.ensurePageIsReady();
    cy.increaseScreenItemsMaxCount(100);
    cy.goToLastPaginatorPage();
    cy.get("@initCount").then((initCount) => {
        cy.getAllItemsCount("table", "tbody tr").then((finalCount) => {
            var initialNo = [100, 101].includes(getWrappedNumber(initCount)) && finalCount == 1 ? 0 : getWrappedNumber(initCount);
            expect(finalCount).to.equal(initialNo);
        });
    });
});

Cypress.Commands.add("assertItemDeletedFromListView", () => {
    cy.ensurePageIsReady();
    cy.increaseScreenItemsMaxCount(100);
    cy.goToLastPaginatorPage();
    cy.get("@initCount").then((initCount) => {
        cy.getAllItemsCount("table", "tbody tr").then((finalCount) => {
            var initialNo = [100, 101].includes(getWrappedNumber(initCount)) && finalCount == 1 ? 0 : getWrappedNumber(initCount);
            expect(finalCount).to.equal(initialNo - 1);
        });
    });
});

Cypress.Commands.add("verifyEditDeleteButtonsNotExistanceWhenPostedStatus", () => {
    // Verify Edit and Delete buttons are not visible
    cy.getByTestAttribute("table_button_edit").should("not.exist");
    cy.getByTestAttribute("table_button_delete").should("not.exist");
}
);

const getWrappedNumber = (x: JQuery<HTMLElement>) => {
    var i = 0;
    if (x != null) {
        i = parseInt(trimText(x.toString()).trim());
    }
    return i;
};

const trimText = (text: string) => text.replace(/\s/g, "").toString().trim();
