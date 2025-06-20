const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const userPackageJsonPath = path.join(projectRoot, "package.json");
const INSTALL_SCRIPT_NAME = "install:commands";
const INSTALL_SCRIPT_COMMAND = "node ./node_modules/cypress-angular-commands/scripts/install-commands.js";

function ensureInstallScriptInUserPackage() {
  if (!fs.existsSync(userPackageJsonPath)) {
    console.warn("⚠️ package.json not found in user project.");
    return;
  }

  const content = fs.readFileSync(userPackageJsonPath, "utf8");
  let packageJson;

  try {
    packageJson = JSON.parse(content);
  } catch (e) {
    console.error("❌ Failed to parse user's package.json:", e.message);
    return;
  }

  packageJson.scripts = packageJson.scripts || {};

  if (!packageJson.scripts[INSTALL_SCRIPT_NAME]) {
    packageJson.scripts[INSTALL_SCRIPT_NAME] = INSTALL_SCRIPT_COMMAND;
    fs.writeFileSync(userPackageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Added "${INSTALL_SCRIPT_NAME}" to user package.json`);
  } else {
    console.log(`ℹ️ "${INSTALL_SCRIPT_NAME}" already exists in user package.json`);
  }
}

// 🏁 Start
console.log("📦 Cypress Angular Commands: postinstall hook");
ensureInstallScriptInUserPackage();
