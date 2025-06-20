const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const targetSupportDir = path.join(projectRoot, "cypress", "support");
const targetAngularCommandsDir = path.join(
  targetSupportDir,
  "angular-commands"
);
const sourceCommandsDir = path.join(__dirname, "src", "support", "commands");
const sourceIndexPath = path.join(__dirname, "src", "support", "index.ts");
const targetIndexPath = path.join(targetAngularCommandsDir, "index.ts");

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function appendImportToUserSupportIndex() {
  const userIndexPath = path.join(targetSupportDir, "index.ts");
  const importStatement = `import './angular-commands/index';`;

  if (fs.existsSync(userIndexPath)) {
    const content = fs.readFileSync(userIndexPath, "utf-8");

    if (!content.includes(importStatement)) {
      fs.appendFileSync(userIndexPath, `\n${importStatement}`);
      console.log("✅ Appended import to existing cypress/support/index.ts");
    } else {
      console.log("ℹ️ Import already exists in index.ts, skipping.");
    }
  } else {
    console.warn(
      "⚠️ Could not find cypress/support/index.ts. Please manually import:\n" +
        importStatement
    );
  }
}

console.log("📦 Installing Cypress Angular Commands...");

try {
  // Copy files
  copyRecursiveSync(
    sourceCommandsDir,
    path.join(targetAngularCommandsDir, "commands")
  );
  fs.copyFileSync(sourceIndexPath, targetIndexPath);

  // Append import to user's index.ts
  appendImportToUserSupportIndex();

  console.log(
    "✅ Commands successfully installed into cypress/support/angular-commands/"
  );
} catch (err) {
  console.error("❌ Failed to install commands:", err.message);
}
