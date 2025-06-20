declare namespace Cypress {
    interface Chainable<Subject> {
        logOut(): Chainable<any>;
        // implementLogin(isInventory: boolean): Chainable<any>;
        // login(): Chainable<any>;
        // loginSession(): Chainable<any>;
        // changeLanguage(isInventory: boolean): Chainable<any>;
        implementLogin(isInventory: boolean): Chainable<any>;
        changeLanguage(isInventory: boolean): Chainable<any>;
        login(): Chainable<any>;
        loginSession(): Chainable<any>;
    }
}

Cypress.Commands.add("changeLanguage", (isInventory: boolean): Cypress.Chainable<any> => {
    cy.catchUnCaughtException();
    cy.ensureStability();

    cy.get("body").then(($body) => {
        if ($body.find("#Email").length > 0) {
            cy.implementLogin(isInventory);
            cy.changeLanguage(isInventory); // Retry after login
        } else {
            cy.log("changeLanguage Already Logged In");
        }
    });

    cy.get("button.btn_profaile", { timeout: 20000 }).first().scrollIntoView().click({ force: true });
    cy.get("button.lang_link", { timeout: 15000 }).first().scrollIntoView().click({ force: true });
    return cy.ensureStability();
});


Cypress.Commands.add("login", (): Cypress.Chainable<any> => {
    const baseUrl = Cypress.env("erpBaseUrl");
    cy.visit(`${baseUrl}/erp`, { failOnStatusCode: false });
    cy.ensureStability();
    return cy.implementLogin(false);
});


Cypress.Commands.add("loginSession", (): Cypress.Chainable<any> => {
    return cy.session("userSession", () => {
        cy.login();
    });
});


Cypress.Commands.add("implementLogin", (isInventory: boolean): Cypress.Chainable<any> => {
    cy.ensureStability();
    const currentUserRegex = new RegExp(
        (isInventory ? "/inventory-apis/" : "/erp-apis/") + "CurrentUserInfo",
        "i"
    );

    cy.intercept("GET", currentUserRegex).as("getCurrentUser");

    cy.get("body").then(($body) => {
        cy.url().then((url) => {
            const shouldLogin =
                $body.find("#Email:visible").length > 0 || url.includes("login?returnUrl");

            if (shouldLogin) {
                cy.get("#Email")
                    .should("be.visible")
                    .clear()
                    .type(Cypress.env("userEmail"))
                    .should("have.value", Cypress.env("userEmail"));

                cy.get("#Password")
                    .should("be.visible")
                    .clear()
                    .type(Cypress.env("userPassword"))
                    .should("have.value", Cypress.env("userPassword"));

                cy.get('button[type="submit"]').first().click({ force: true });

                cy.ensureStability();
                cy.wait("@getCurrentUser", { timeout: 20000 }).its("response.statusCode").should("eq", 200);
                cy.ensureStability();
            }
        });
    });

    return cy.ensureStability();
});

Cypress.Commands.add("logOut", () => {
    cy.get("button.btn_profaile").first().scrollIntoView().then(($el) => {
        if ($el.is(":visible")) {
            cy.wrap($el).click({ force: true });
            cy.ensureStability();
            cy.get('button[class="log_link"]').first().should("be.visible").click({ force: true });
            cy.ensureStability();
        } else {
            cy.log("Element is not visible");
        }
    });
});
