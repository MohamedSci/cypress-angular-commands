const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const userPackageJsonPath = path.join(projectRoot, "package.json");

const targetSupportDir = path.join(projectRoot, "cypress", "support");
const targetAngularCommandsDir = path.join(
  targetSupportDir,
  "angular-commands"
);
const sourceDistDir = path.join(__dirname, "dist", "commands");

const SUPPORT_INDEX_TS = path.join(targetSupportDir, "index.ts");
const SUPPORT_INDEX_JS = path.join(targetSupportDir, "index.js");
const IMPORT_LINE = `import './angular-commands';`;
const INSTALL_SCRIPT_NAME = "install:commands";
const INSTALL_SCRIPT_COMMAND =
  "node ./node_modules/cypress-angular-commands/install-commands.js";

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠️ Source folder ${src} not found.`);
    return;
  }

  fs.mkdirSync(dest, { recursive: true });

  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

function appendImportIfMissing(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  if (!content.includes(IMPORT_LINE)) {
    fs.appendFileSync(filePath, `\n${IMPORT_LINE}`);
    console.log(`✅ Appended import to ${path.basename(filePath)}`);
  } else {
    console.log(`ℹ️ Import already present in ${path.basename(filePath)}`);
  }
}

function ensureScriptInPackageJson() {
  if (!fs.existsSync(userPackageJsonPath)) {
    console.warn("⚠️ package.json not found in project root.");
    return;
  }

  const packageData = JSON.parse(fs.readFileSync(userPackageJsonPath, "utf8"));
  packageData.scripts = packageData.scripts || {};

  if (!packageData.scripts[INSTALL_SCRIPT_NAME]) {
    packageData.scripts[INSTALL_SCRIPT_NAME] = INSTALL_SCRIPT_COMMAND;
    fs.writeFileSync(userPackageJsonPath, JSON.stringify(packageData, null, 2));
    console.log(`✅ Added "${INSTALL_SCRIPT_NAME}" to package.json scripts`);
  } else {
    console.log(`ℹ️ "${INSTALL_SCRIPT_NAME}" script already exists. Skipping.`);
  }
}

function main() {
  console.log("📦 Installing Cypress Angular Commands...");

  copyRecursiveSync(sourceDistDir, targetAngularCommandsDir);

  if (fs.existsSync(SUPPORT_INDEX_TS)) {
    appendImportIfMissing(SUPPORT_INDEX_TS);
  } else if (fs.existsSync(SUPPORT_INDEX_JS)) {
    appendImportIfMissing(SUPPORT_INDEX_JS);
  } else {
    console.warn("⚠️ Could not find cypress/support/index.ts or index.js.");
  }

  ensureScriptInPackageJson();

  console.log(
    "✅ Custom commands installed into cypress/support/angular-commands/"
  );
}

main();
