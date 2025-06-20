const fs = require("fs");
const path = require("path");

const SOURCE_DIR = path.join(__dirname, "..", "dist", "commands");
const DEST_DIR = path.join(
  process.cwd(),
  "cypress",
  "support",
  "angular-commands"
);
const SUPPORT_INDEX_TS = path.join(
  process.cwd(),
  "cypress",
  "support",
  "index.ts"
);
const SUPPORT_INDEX_JS = path.join(
  process.cwd(),
  "cypress",
  "support",
  "index.js"
);
const IMPORT_LINE = `import './angular-commands';`;

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`❌ Source folder does not exist: ${src}`);
    process.exit(1);
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
    console.log(`✅ Added import to ${path.basename(filePath)}`);
  } else {
    console.log(`ℹ️ Import already exists in ${path.basename(filePath)}`);
  }
}

function main() {
  console.log("📦 Installing Cypress Angular Commands...");

  copyRecursiveSync(SOURCE_DIR, DEST_DIR);

  if (fs.existsSync(SUPPORT_INDEX_TS)) {
    appendImportIfMissing(SUPPORT_INDEX_TS);
  } else if (fs.existsSync(SUPPORT_INDEX_JS)) {
    appendImportIfMissing(SUPPORT_INDEX_JS);
  } else {
    console.warn("⚠️ Could not find cypress/support/index.ts or index.js");
  }

  console.log("✅ Commands copied to: cypress/support/angular-commands/");
}

main();
