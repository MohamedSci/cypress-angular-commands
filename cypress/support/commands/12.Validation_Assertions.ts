type SoftAssertionResult = {
  description: string;
  passed: boolean;
  error?: Error;
  expected?: any;
  actual?: any;
  subject?: any;
};

declare namespace Cypress {
  interface Chainable<Subject> {
    softAssertValue(actual: any, expected: any, message?: any): Chainable<any>;
    softAssertElement(element: JQuery<HTMLElement>, assertion: string | ((element: JQuery<HTMLElement>) => void), expected?: any, description?: string): Chainable<void>;
    softAssert(assertionFn: (subject: any) => void, description: string, options?: { expected?: any; subjectAlias?: string }): Chainable<void>;
  }
}

Cypress.Commands.add("softAssertElement", (element: JQuery<HTMLElement>, assertion: string | ((element: JQuery<HTMLElement>) => void), expected?: any, description = "Soft assertion") => {
  cy.wrap(element).should(($el: JQuery<HTMLElement>) => {
    try {
      if (typeof assertion === "function") {
        assertion($el);
      } else {
        // Handle Chai assertions safely
        const assertionChain = expect($el);
        if (assertion in assertionChain) {
          // Type-safe dynamic assertion call
          (assertionChain as any)[assertion](expected);
        } else {
          throw new Error(`Invalid assertion: ${assertion}`);
        }
      }

      Cypress.log({
        name: "Soft Assert",
        message: `✅ PASS: ${description}`,
        consoleProps: () => ({ status: "passed" }),
      });
    } catch (err) {
      Cypress.log({
        name: "Soft Assert",
        message: `❌ FAIL: ${description}`,
        consoleProps: () => ({
          status: "failed",
          error: err instanceof Error ? err.message : String(err),
          element: $el,
        }),
      });
    }
  });
}
);

Cypress.Commands.add("softAssertValue", (actual: any, expected: any, message: any = "Soft assertion") => {
  try {
    expect(actual).to.equal(expected);

    Cypress.log({
      name: "Soft Assert",
      message: `✅ PASS: ${message}`,
      consoleProps: () => ({ actual, expected }),
    });
  } catch (err: any) {
    Cypress.log({
      name: "Soft Assert",
      message: `❌ FAIL: ${message}`,
      consoleProps: () => ({ error: err.message, actual, expected }),
    });
  }
}
);

let softAssertionResults: SoftAssertionResult[] = [];

Cypress.Commands.add("softAssert", { prevSubject: ["optional", "element", "window", "document"] }, (subject: any,
  assertionFn: (subject: any) => void,
  description: string,
  options = {}
): Cypress.Chainable<void> => {
  // Explicit return type
  const { expected, subjectAlias = "" } = options as {
    expected?: any;
    subjectAlias?: string;
  };
  let actual;
  let passed = false;
  let error: Error | undefined;

  try {
    assertionFn(subject);
    actual = subject;
    passed = true;
  } catch (err) {
    error = err instanceof Error ? err : new Error(String(err));
    actual = error.message.includes("expected")
      ? error.message.split("expected")[1]?.split("to")[0]?.trim()
      : subject;
  }

  const result: SoftAssertionResult = {
    description,
    passed,
    error,
    expected,
    actual,
    subject: subjectAlias || subject,
  };

  softAssertionResults.push(result);

  Cypress.log({
    name: "softAssert",
    message: `${passed ? "✅ PASS" : "❌ FAIL"}: ${description}`,
    consoleProps: () => ({
      Status: passed ? "Passed" : "Failed",
      Description: description,
      Subject: result.subject,
      Expected: expected,
      Actual: actual,
      ...(error ? { Error: error.message, "Stack Trace": error.stack } : {}),
    }),
  });

  // Return void explicitly to match Chainable<void>
  return cy.wrap(undefined, { log: false }) as Cypress.Chainable<void>;
}
);

