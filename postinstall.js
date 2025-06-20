const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const userPackageJsonPath = path.join(projectRoot, "package.json");
const expectedScriptName = "install:commands";
const expectedScriptValue =
  "node ./node_modules/cypress-enterprise-commands/scripts/install-commands.js";

function adviseIfMissingScript() {
  if (!fs.existsSync(userPackageJsonPath)) {
    console.warn("⚠️ No package.json found in project root.");
    return;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(userPackageJsonPath, "utf-8"));
    const scripts = pkg.scripts || {};

    if (!scripts[expectedScriptName]) {
      console.warn(
        `⚠️ "${expectedScriptName}" not found in package.json scripts.`
      );
      console.info(
        `💡 To enable command installation manually, add this script to your package.json:\n\n  "${expectedScriptName}": "${expectedScriptValue}"\n`
      );
    } else {
      console.log(`✅ "${expectedScriptName}" already present.`);
    }
  } catch (err) {
    console.error("❌ Failed to read user's package.json:", err.message);
  }
}

// Run it
console.log("📦 Cypress Angular Commands: postinstall check...");
adviseIfMissingScript();
