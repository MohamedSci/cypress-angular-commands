# 🚀 Cypress Enterprise Commands

![npm](https://img.shields.io/npm/v/cypress-enterprise-commands)  
![Cypress](https://img.shields.io/badge/Cypress-Tested-brightgreen)  
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

> ✅ **A complete, production-ready library of reusable Cypress custom commands for enterprise web applications** — ideal for Angular, PrimeNG, React, Laravel, and complex UI frameworks.

---

## 🎯 Purpose

**`cypress-enterprise-commands`** is a comprehensive utility toolkit that helps Cypress testers write clear, stable, and efficient tests for modern frontend-heavy applications — particularly **enterprise and ERP systems**.

It provides 80+ powerful custom commands for:

- Tables, filters, labels, dialogs, dropdowns, inputs, and more.
- Handling edge cases, async rendering, UI validation, and interaction.
- Reducing boilerplate and making tests scalable and DRY.

---

## 📦 Installation

```bash
npm install cypress-enterprise-commands
```

Then run the install command to copy reusable commands to your Cypress project:

```bash
npm run install:commands
```

> ✅ This will copy commands into `cypress/support/enterprise-commands/` and automatically import them into your `cypress/support/index.ts`.

---

## 📂 Directory Structure (After Installation)

```bash
cypress/
├── support/
│   ├── enterprise-commands/
│   │   ├── 1.Search_Filter_Verifications.ts
│   │   ├── 2.Element_Visibility_StateChecks.ts
│   │   ├── ...
│   └── index.ts  <-- Automatically updated to import all commands
```

---

## ⚙️ Setup in `package.json` (Optional)

If not already added, you can include this script for future reinstalls:

```json
"scripts": {
  "install:commands": "node ./node_modules/cypress-enterprise-commands/scripts/install-commands.js"
}
```

---

## ✅ What’s Included?

> 🧩 80+ fully typed custom commands, organized in 14 modules:

| 📁 File                                          | 🔎 Purpose                                         |
| ------------------------------------------------ | -------------------------------------------------- |
| `1.Search_Filter_Verifications.ts`               | Table search field testing & filtering validations |
| `2.Element_Visibility_StateChecks.ts`            | Assert visibility, enablement, and element state   |
| `3.TableVerifications.ts`                        | Validate rows, columns, headers, pagination        |
| `4.Label_Text_Placeholder_ValueVerifications.ts` | Check form labels, values, placeholders            |
| `5.Button_Dialog_Interactions.ts`                | Handle modals, confirms, alerts, and buttons       |
| `6.List_View_Assertions.ts`                      | Smart list view interactions                       |
| `7.PageAndNavigation.ts`                         | Utilities for reloads, waits, and page control     |
| `8.Table_Interaction_CellRetrieval.ts`           | Read and interact with specific cell values        |
| `9.Multi-select_Dropdown.ts`                     | Select, deselect, and validate dropdowns           |
| `10.Generic_Helpers.ts`                          | Scrolling, stabilization, retry helpers            |
| `11.Input_TextHandling.ts`                       | Smart typing and clearing strategies               |
| `12.Validation_Assertions.ts`                    | Required fields, error messages, form errors       |
| `13.login.ts`                                    | Login workflows and protected area access          |
| `14.Specialized_Modules_Scenarios.ts`            | ERP and enterprise-specific UI logic               |

---

## 🧪 Example Usages

```ts
// Search a table by a value in multiple columns
cy.verifySearchFunctionality('[data-test="search-box"]', [1, 2]);

// Conditionally get a cell value from a row
cy.getCellValueWhenCondition(3, 0, "Confirmed").then((val) => {
  expect(val).to.include("Invoice");
});

// Validate form elements
cy.verifyLabelText('[data-test="email-label"]', "Email");
cy.verifyPlaceholder('[data-test="email-input"]', "Enter your email");

// Interact with PrimeNG-style dropdown
cy.selectAllStatusExceptPostFilter("status-dropdown", 3);
```

---

## 💼 Best Fit For:

- ERP systems (Sales, HR, Finance, Inventory, etc.)
- Angular, React, Laravel Blade UI, or any table/form-heavy apps
- Projects using PrimeNG, Material UI, or Bootstrap

---

## 💡 Pro Tips & Best Practices

- All commands use safe timeouts, retry logic, and stability checks.
- Use alongside Cypress fixtures, aliases, and intercepts for max power.
- Works in JavaScript and TypeScript Cypress setups.
- Zero conflicts: placed under `support/enterprise-commands/` and won't override your custom files.

---

## 🌍 SEO Keywords (for discoverability)

- Cypress reusable custom commands
- Cypress PrimeNG dropdown/table helpers
- Cypress ERP test automation library
- Angular UI Cypress commands
- Cypress enterprise testing toolkit
- Cypress component interaction helpers

---

## 🤝 Contributing

We welcome your ideas, fixes, and new commands!

1. Fork the repo
2. Add your features or fixes
3. Submit a pull request with description

---

## 🛡 License

Apache-2.0 — Free for commercial and personal use.

---

## 👨‍💻 Author

**Mohamed Said**
QA Automation Architect | Cypress Mentor
🔗 [LinkedIn](https://www.linkedin.com/in/mohamedsaidibrahim)
🔗 [GitHub](https://github.com/MohamedSci)
🔗 [Medium](https://medium.com/@mohamedsaidibrahim)

---

> ⭐ If this package helped you, give it a star and share with your team!

---

**Test smarter. Automate faster. Scale confidently — with `cypress-enterprise-commands`.**

```

```
