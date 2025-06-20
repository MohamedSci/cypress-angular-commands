declare namespace Cypress {
  interface Chainable<Subject> {
    navigateToTheLatestScreen(): Chainable<any>;
    navigateToJournalEntryViewScreen(): Chainable<any>;
    switchingToERPModule(urlStr: string, keywordStr: string, majorIndex: number): Chainable<any>;
    switchBetweenTabs(index: number): Chainable<any>;
    zoomOut(): Chainable<any>;
    isPageStable(): Chainable<any>;
    waitForNetworkIdle(options?: { timeout?: number; log?: boolean; interval?: number }): Chainable<void>;
    reloadScreen(): Chainable<any>;
    goBack(): Chainable<any>;
    clickAddNew(): Chainable<any>;
    ensureStability(): Chainable<any>;
    erpModuleLanding(moduleExtension: string): Chainable<any>;
  }
}

let loginRetryCount = 0;

Cypress.Commands.add("erpModuleLanding", (moduleExtension: string) => {
  const isInventory = moduleExtension.includes("inventory");
  const fullUrl = `${Cypress.env("erpBaseUrl")}${moduleExtension}`;
  const apiPath = isInventory ? "inventory-apis" : "erp-apis";

  cy.url().then((currentUrl) => {
    if (!currentUrl.includes(moduleExtension)) {
      cy.visit(fullUrl, { failOnStatusCode: false });
    } else {
      cy.log(`✅ Already on module: ${moduleExtension}`);
    }

    cy.ensureStability();
    cy.catchUnCaughtException();

    cy.url().then((urlAfterVisit) => {
      const redirectedToLogin =
        urlAfterVisit.includes("login?returnUrl") ||
        !urlAfterVisit.includes(moduleExtension);

      if (redirectedToLogin) {
        if (loginRetryCount >= 2) {
          throw new Error("🛑 Too many login retries.");
        }

        cy.log("🔁 Redirected to login. Retrying login...");
        loginRetryCount++;
        cy.implementLogin(isInventory);
        cy.erpModuleLanding(moduleExtension);
        return;
      }

      // Ensure we're on the correct URL
      cy.url({ timeout: 45000 }).should("include", moduleExtension);

      // Ensure the page has finished loading
      cy.get(".spinner-overlay", { timeout: 30000 }).should("not.exist");

      // Confirm side menu or key element is visible
      cy.get("p.date", { timeout: 60000 })
        .filter(":visible")
        .first()
        .scrollIntoView()
        .should("be.visible")
        .then(($el) => {
          const text = $el.text().trim();
          cy.log(`📋 Detected first visible menu item: ${text}`);

          const isArabic = /[\u0600-\u06FF]/.test(text);
          if (isArabic) {
            cy.log("🌐 Arabic detected in menu. Switching language...");
            cy.changeLanguage(isInventory);
          }
        });

      cy.ensureStability();
      loginRetryCount = 0; // Reset retry count after successful load
    });
  });
});



Cypress.Commands.add("navigateToTheLatestScreen", () => {
  cy.get("table").should("be.visible");
  cy.get("table").then(($table) => {
    if ($table.find("tbody").is(":visible")) {
      cy.get("tbody").then((tbody) => {
        if (tbody.find("tr").is(":visible")) {
          cy.wrap(tbody).find("tr").last().scrollIntoView();
          if (tbody.find("tr").length >= 25) {
            cy.get("p-paginator").then((paginator) => {
              if (
                paginator.find('button[aria-label="Last Page"]').is(":visible")
              ) {
                cy.get('button[aria-label="Last Page"]').click({ force: true });
              }
            });
          } else {
            cy.log("the count of rows less than 25");
          }
        }
      });
    } else {
      throw new Error("Table is not visible");
    }
  });
});

Cypress.Commands.add("navigateToJournalEntryViewScreen", () => {
  cy.ensureStability();
  cy.switchingToERPModule(
    Cypress.env("erpBaseUrl") + "/accounting/transactions/journalentry",
    "transactions/" + "journalentry",
    -2
  );
});

Cypress.Commands.add("switchingToERPModule", (urlStr: string, keywordStr: string, majorIndex: number) => {
  cy.catchUnCaughtException();
  cy.viewport(1920, 1080);
  cy.visit(urlStr, { failOnStatusCode: false });
  cy.ensureStability();
  cy.url().then((currentUrl) => {
    if (!currentUrl.includes(keywordStr)) {
      // Click on the next elements, ensuring each is visible
      // Click the Side Slider
      cy.ensureStability();
      cy.get('div[class="sidebar close"]')
        .find("div i:nth-child(1)")
        .should("be.visible");
      cy.get('div[class="sidebar close"]')
        .find("div i:nth-child(1)")
        .last()
        .click({ force: true });
      // Click Master / Transaction / Report Data DropDown Arrow
      cy.get("i.arrow.pi")
        .eq(majorIndex)
        .scrollIntoView()
        .click({ force: true });
      // Select The Fourth Module
      cy.get(`a[link="${keywordStr}"]`)
        .last()
        .scrollIntoView()
        .should("be.visible"); // Clicks the element
      cy.get(`a[link="${keywordStr}"]`)
        .last()
        .scrollIntoView()
        .click({ force: true }); // Clicks the element
      cy.ensureStability();
    }
  });
}
);

Cypress.Commands.add("switchBetweenTabs", (index: number) => {
  cy.get('a[role="tab"]').eq(index).scrollIntoView().click({ force: true });
});

Cypress.Commands.add("zoomOut", () => {
  cy.viewport(1920, 1080);
  cy.window().then((win) => {
    (win.document.body.style as any).zoom = "95%"; // Zoom out to 80%
  });
});

Cypress.Commands.add('waitForNetworkIdle', { prevSubject: false }, (options: { timeout?: number; log?: boolean; interval?: number } = {}) => {
  const { timeout = 10000, log = true, interval = 500 } = options;

  if (log) {
    Cypress.log({
      name: 'waitForNetworkIdle',
      message: `Waiting for network idle (timeout: ${timeout}ms)`,
    });
  }

  return cy.window({ log: false }).then({ timeout: timeout + 1000 }, (win) => {
    return new Cypress.Promise<void>((resolve, reject) => {
      let timedOut = false;
      const timeoutId = setTimeout(() => {
        timedOut = true;
        reject(new Error(`Network did not become idle within ${timeout}ms`));
      }, timeout);

      const checkRequests = () => {
        const pendingRequests = (win as any)._networkState?.pendingRequests || 0;

        if (log) {
          cy.log(`Pending requests: ${pendingRequests}`);
        }

        if (pendingRequests === 0) {
          clearTimeout(timeoutId);
          resolve();
        } else if (!timedOut) {
          setTimeout(checkRequests, interval);
        }
      };

      checkRequests();
    });
  });
}
);

Cypress.Commands.add("reloadScreen", () => {
  cy.ensureStability();
  cy.reload();
  cy.ensureStability();
  cy.get(".spinner-overlay").should("not.exist", { timeout: 30000 });
});

Cypress.Commands.add("goBack", () => {
  cy.get('body').then(($body) => {
    const cancelButtons = $body.find('button:contains("Cancel"), button:contains("Back") ');
    if (cancelButtons.is(':visible')) {
      cy.wrap(cancelButtons.first()).click({ force: true, multiple: true });
      cy.log("Clicked 'Cancel' button.");
      return; // Exit after clicking
    } else {
      cy.logMsg("No 'Cancel' or 'Back' button found, proceeding to history back.");
    }
  });
  cy.ensureStability();
});

Cypress.Commands.add("clickAddNew", () => {
  const addNewButtons = 'button:contains("Add"), button:contains("Create") ';
  cy.get(addNewButtons, { timeout: 45000 }).last().scrollIntoView().click({ force: true });
  cy.ensureStability();
  cy.get(".spinner-overlay").should("not.exist", { timeout: 30000 });
  cy.contains("button", /save/i).should("be.visible");
});

Cypress.Commands.add("ensureStability", () => {
  cy.waitForNetworkIdle();
  cy.isPageStable();
});

Cypress.Commands.add("isPageStable", () => {
  cy.window().then(() => isPageStable());
  cy.logMsg("Stable");
});

function isPageStable() {
  const mutationObserver = new MutationObserver(() => { });
  return new Cypress.Promise((resolve) => {
    const timeout = setTimeout(() => {
      mutationObserver.disconnect();
      resolve(true);
    }, 1000); // Adjust for stability period

    mutationObserver.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      mutationObserver.disconnect();
      clearTimeout(timeout);
      resolve(false);
    }, 250); // Adjust to wait longer if needed
  });
}