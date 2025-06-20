const fs = require("fs");
const path = require("path");

const targetRoot = path.join(process.cwd(), "cypress", "support");
const targetCommands = path.join(targetRoot, "commands");
const sourceRoot = path.join(__dirname, "src", "support");

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

console.log("📦 Installing Cypress Angular Commands...");

try {
  copyRecursiveSync(path.join(sourceRoot, "commands"), targetCommands);
  fs.copyFileSync(
    path.join(sourceRoot, "index.ts"),
    path.join(targetRoot, "index.ts")
  );
  console.log("✅ Custom commands successfully added to your Cypress project.");
} catch (err) {
  console.error("❌ Failed to copy custom commands:", err);
}
