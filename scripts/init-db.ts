import { turso } from "../src/lib/db";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function initDatabase() {
  const schema = fs.readFileSync(
    path.join(__dirname, "../src/lib/schema.sql"),
    "utf-8"
  );

  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    await turso.execute(statement);
    console.log("✓", statement.split("\n")[0].substring(0, 60) + "...");
  }

  console.log("\n🎉 Database initialized successfully!");
}

initDatabase().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
