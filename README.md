# 🌟 Cypress Angular Commands – Reusable Custom Commands for Angular Apps

![npm](https://img.shields.io/npm/v/cypress-angular-commands) ![Cypress](https://img.shields.io/badge/Cypress-Tested-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

> ✅ A robust, production-ready collection of reusable Cypress custom commands specifically tailored for modern Angular-based enterprise applications and ERP systems.

---

## 🚀 Why This Package?

Angular applications come with unique UI components, async challenges, and dynamic rendering. This package solves common testing problems with **plug-and-play** custom commands to help you:

- Validate **tables, filters, dropdowns, dialogs, labels, and more** with zero setup.
- Automate **complex data-driven scenarios** quickly.
- Reduce boilerplate code and focus on testing logic, not element selection.
- Make test scripts more **readable, stable, and maintainable**.

---

## 📦 Installation

```bash
npm install cypress-angular-commands
````

> ✨ This package automatically adds all commands under `cypress/support/commands/` and configures the `index.ts` to register them.

---

## 🔧 Setup (Auto-configured)

After installation, the following will be added to your project:

```
cypress/
└── support/
    ├── commands/
    │   ├── 1.Search_Filter_Verifications.ts
    │   ├── 2.Element_Visibility_StateChecks.ts
    │   ├── ...
    └── index.ts
```

No manual import needed. You’re ready to write Cypress tests instantly.

---

## ✅ What's Included?

> 80+ reusable commands, organized into 14 logical categories:

| Category                     | File Path                                        | Description                                          |
| ---------------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| 🔍 Search & Filters          | `1.Search_Filter_Verifications.ts`               | Dynamic search bar validation with table column sync |
| 👀 Visibility & State Checks | `2.Element_Visibility_StateChecks.ts`            | Assertions for presence, visibility, enable/disable  |
| 📊 Table Validations         | `3.TableVerifications.ts`                        | Table row, column, header, pagination verifications  |
| 🏷️ Label/Text/Placeholder   | `4.Label_Text_Placeholder_ValueVerifications.ts` | Assert values of form elements and labels            |
| 🔘 Buttons & Dialogs         | `5.Button_Dialog_Interactions.ts`                | Handle modal, confirm, alerts, buttons               |
| 📋 List Views                | `6.List_View_Assertions.ts`                      | Reusable assertions for grid/list views              |
| 📄 Page Navigation           | `7.PageAndNavigation.ts`                         | Smart page reloads, waits, stability helpers         |
| 📥 Table Cell Interaction    | `8.Table_Interaction_CellRetrieval.ts`           | Cell value extraction and interactions               |
| 🧾 Multi-select Dropdowns    | `9.Multi-select_Dropdown.ts`                     | Handle PrimeNG dropdowns and checkboxes              |
| 🛠️ Generic Helpers          | `10.Generic_Helpers.ts`                          | Common utility methods (waits, reloading, scrolling) |
| ✏️ Text Input & Typing       | `11.Input_TextHandling.ts`                       | Smart typing, clearing, appending                    |
| ⚠️ Validation Assertions     | `12.Validation_Assertions.ts`                    | Required fields, error highlights                    |
| 🔐 Login Workflow            | `13.login.ts`                                    | Built-in login commands for protected apps           |
| 📦 Specialized ERP Scenarios | `14.Specialized_Modules_Scenarios.ts`            | Real-world enterprise patterns                       |

---

## 🧪 Example Usage

```ts
// search for a value in table and validate filtering
cy.verifySearchFunctionality('[data-test="search"]', [1, 2]);

// extract value from table conditionally
cy.getCellValueWhenCondition(2, 0, 'Confirmed').then((val) => {
  expect(val).to.contain('Invoice');
});

// validate form label and placeholder
cy.verifyLabelText('[data-test="email-label"]', 'Email Address');
cy.verifyPlaceholder('[data-test="email-input"]', 'Enter your email');
```

---

## 📚 Use Cases

* Testing Angular-based ERP systems with complex UIs
* Form, list, and table-driven modules (e.g., Sales, Finance, HR)
* Streamlining repetitive frontend test cases in enterprise apps
* Improving coverage without bloated test scripts

---

## 💡 Best Practices

* Use these commands in combination with Cypress custom fixtures and aliases
* All commands are asynchronous-safe and include timeouts/stability checks
* They work seamlessly with PrimeNG, Material UI, and other Angular UI libraries

---

## 🛡️ Already using Cypress with your own commands?
This package will automatically:
- Add commands under `cypress/support/angular-commands/`
- Append a safe import to your existing `cypress/support/index.ts`
- **Does NOT overwrite your files or affect your specs**

---

## 📈 SEO Keywords (for Google indexing)

* Cypress custom commands for Angular
* Cypress ERP UI test helpers
* Cypress PrimeNG table and dropdown testing
* Reusable Cypress functions for enterprise apps
* Cypress test automation Angular UI

---

## 🤝 Contributing

Have improvements or ideas? Want to add support for other component libraries?

We welcome pull requests and suggestions! Fork the repo, add features, and send a PR. Or simply open an issue.

---

## 📃 License

Apache-2.0 License – Free to use

---

## ✨ Author

**Mohamed Said**
Automation Architect | QA Mentor | Cypress Expert
[LinkedIn](https://www.linkedin.com/in/mohamedsaidibrahim/) | [GitHub](https://github.com/MohamedSci) | [Medium](https://medium.com/@mohamedsaidibrahim)

---

**Make your Angular test automation clean, scalable, and powerful – with Cypress Angular Commands.**

> ⭐ Star this package and share it with your QA network!

```