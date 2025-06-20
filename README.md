# 🌟 Cypress Angular Commands – Reusable Custom Commands for Angular Apps

![npm](https://img.shields.io/npm/v/cypress-angular-commands)
![Cypress](https://img.shields.io/badge/Cypress-Tested-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

> ✅ A robust, production-ready collection of **professional Cypress custom commands** designed for Angular-based enterprise applications and ERP systems.

---

## 🚀 Why Use This Package?

Testing Angular applications can be challenging due to dynamic components, async rendering, PrimeNG quirks, and heavy forms.

This package provides **ready-made Cypress custom commands** that:

- Handle complex interactions with **tables, forms, dialogs, dropdowns, validations, and more**
- Follow **professional naming conventions**, mirroring real test case intent
- Provide **stable, readable, and reusable** test logic out-of-the-box
- Require **zero configuration** – just plug and play

> 🎯 Ideal for ERP systems and enterprise apps with rich Angular front-ends (PrimeNG, Angular Material, etc.)

---

## 📦 Installation

```bash
npm install cypress-angular-commands
````

---

## 🛠 Add Install Script (One-Time Setup)

To prepare the commands in your existing Cypress project, add this to your `package.json`:

```json
"scripts": {
  "install:commands": "node ./node_modules/cypress-angular-commands/scripts/install-commands.js"
}
```

Then run:

```bash
npm run install:commands
```

This will copy the custom command files to:

```
cypress/support/angular-commands/
```

and safely import them in `cypress/support/index.ts` (without affecting your existing commands).

---

## ✅ What's Included?

> 80+ ready-to-use Cypress custom commands, categorized into 14 robust files:

| Category                     | File Path                                        | Description                                                      |
| ---------------------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| 🔍 Search & Filters          | `1.Search_Filter_Verifications.ts`               | Search field tests linked to table column values                 |
| 👀 Visibility & State Checks | `2.Element_Visibility_StateChecks.ts`            | Presence, visibility, enable/disable, loading states             |
| 📊 Table Validations         | `3.TableVerifications.ts`                        | Header, cell, row counts, sorting, and pagination assertions     |
| 🏷️ Labels & Placeholders    | `4.Label_Text_Placeholder_ValueVerifications.ts` | Accurate label, placeholder, and input value verifications       |
| 🔘 Buttons & Dialogs         | `5.Button_Dialog_Interactions.ts`                | Button clicks, dialog open/close, confirmation interactions      |
| 📋 List View Assertions      | `6.List_View_Assertions.ts`                      | Validate list/grid items rendering and values                    |
| 📄 Navigation & Reload       | `7.PageAndNavigation.ts`                         | Intelligent page reloads, stability waits, route checks          |
| 📥 Table Interactions        | `8.Table_Interaction_CellRetrieval.ts`           | Extract or act on table cell values based on conditions          |
| 🧾 Multi-select Dropdowns    | `9.Multi-select_Dropdown.ts`                     | PrimeNG dropdown, checkbox, and filter interaction               |
| 🛠️ Generic Helpers          | `10.Generic_Helpers.ts`                          | Common reusable utilities (stability, scroll, wait, assert fail) |
| ✏️ Input Handling            | `11.Input_TextHandling.ts`                       | Type, clear, append, and check values professionally             |
| ⚠️ Validations               | `12.Validation_Assertions.ts`                    | Required field marks, error highlights, validation triggers      |
| 🔐 Login Helpers             | `13.login.ts`                                    | Standard login workflow and session management                   |
| ⚙️ Specialized Modules       | `14.Specialized_Modules_Scenarios.ts`            | ERP-specific modules and edge-case UI testing                    |

> 🔁 Each file is modular and extensible for large teams and CI/CD flows.

---

## 💡 How It Works

Once installed via `npm run install:commands`, this package will:

* 📁 Copy all command files into `cypress/support/angular-commands/`
* 🧩 Append a `require/import` into your `support/index.ts` if it exists
* 🛡️ **Never override your existing custom commands or files**
* 🔄 Ready for use across multiple specs with full TypeScript support

---

## 🔧 Setup Example

Directory Structure:

```
cypress/
└── support/
    ├── angular-commands/
    │   ├── 1.Search_Filter_Verifications.ts
    │   ├── ...
    ├── index.ts   ← Includes the imports for these commands
```

---

## 🧪 Sample Usage

```ts
// Test search field filters table correctly
cy.verifySearchFunctionality('[data-test="search-input"]', [1, 2]);

// Get a table cell value where another cell matches "Confirmed"
cy.getCellValueWhenCondition(2, 0, 'Confirmed').then((val) => {
  expect(val).to.contain('Invoice');
});

// Verify label and placeholder values
cy.verifyLabelText('[data-test="email-label"]', 'Email Address');
cy.verifyPlaceholder('[data-test="email-input"]', 'Enter your email');
```

---

## 📚 Real-World Use Cases

* 🔁 Angular-based ERP apps (Sales, HR, Inventory, Finance)
* 🧾 Forms with PrimeNG dropdowns, checkboxes, validations
* 📊 Table-driven dashboards with filters, search, sort, and pagination
* 🔐 Protected workflows with login-based session handling
* 🧼 Writing clean, DRY, and readable tests across modules

---

## ✅ Best Practices

* Use these commands along with fixtures, aliases, and intercepts
* Keep your specs clean and lean — most test logic lives in these commands
* Use TypeScript for type safety and IDE autocomplete
* Assert with `should`, `expect`, and built-in stability checkers
* Integrate in CI pipelines with ease

---

## 🛡 Safe for Existing Projects

This package:

* ✅ Adds a **new subfolder** under `support/`
* ✅ Appends `import './angular-commands/...';` to your `index.ts`
* 🚫 **Does not overwrite** existing commands or test specs
* ⚙️ Works with JS and TS-based Cypress projects

---

## 🌐 SEO Keywords

* Cypress Angular custom commands
* Cypress PrimeNG dropdown and table testing
* Cypress ERP automation
* Cypress reusable UI testing helpers
* Test automation for Angular apps
* Cypress enterprise project automation
* Custom Cypress commands for UI components

---

## 🤝 Contribute

Suggestions, bug fixes, or ideas welcome!

* Fork this repo
* Create your feature branch (`git checkout -b feature/new-helper`)
* Commit your changes
* Submit a pull request 🎉

Or open an issue to request enhancements.

---

## 📃 License

**Apache-2.0 License** – Use freely in personal or commercial projects.

---

## ✨ Author

**Mohamed Said**
Automation Architect | QA Mentor | Cypress Specialist

* [LinkedIn](https://www.linkedin.com/in/mohamedsaidibrahim/)
* [GitHub](https://github.com/MohamedSci)
* [Medium](https://medium.com/@mohamedsaidibrahim)

---

**Make your Angular test automation clean, scalable, and powerful – with Cypress Angular Commands.**

### ⭐ Star it on NPM and GitHub if you find it useful!

```bash
npm install cypress-angular-commands
npm run install:commands
```


## > 🧠 Now you're ready to write enterprise-grade Cypress tests – in minutes, not hours.

```