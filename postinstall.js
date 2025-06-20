const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const targetSupportDir = path.join(projectRoot, "cypress", "support");
const targetAngularCommandsDir = path.join(
  targetSupportDir,
  "angular-commands"
);
const sourceDistDir = path.join(__dirname, "dist", "support");

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

function appendImportToIndex() {
  const indexPathTS = path.join(targetSupportDir, "index.ts");
  const indexPathJS = path.join(targetSupportDir, "index.js");
  const importLine = `import './angular-commands/index';`;

  const indexFile = fs.existsSync(indexPathTS)
    ? indexPathTS
    : fs.existsSync(indexPathJS)
    ? indexPathJS
    : null;

  if (indexFile) {
    const content = fs.readFileSync(indexFile, "utf-8");
    if (!content.includes(importLine)) {
      fs.appendFileSync(indexFile, `\n${importLine}`);
      console.log(`✅ Appended import to ${path.basename(indexFile)}`);
    } else {
      console.log("ℹ️ Import already present. Skipping.");
    }
  } else {
    console.warn("⚠️ Could not find cypress/support/index.ts or index.js.");
  }
}

console.log("📦 Installing Cypress Angular Commands...");

try {
  copyRecursiveSync(sourceDistDir, targetAngularCommandsDir);
  appendImportToIndex();
  console.log(
    "✅ Custom commands installed into cypress/support/angular-commands/"
  );
} catch (err) {
  console.error("❌ Failed to install commands:", err.message);
}
