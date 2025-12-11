import { turso } from "../src/lib/db";

async function test() {
  console.log("Testing database connection...\n");

  // Test insert
  const result = await turso.execute({
    sql: "INSERT INTO users (username, email) VALUES (?, ?)",
    args: ["testuser", "test@example.com"],
  });
  console.log("✓ Inserted user with ID:", result.lastInsertRowid);

  // Test query
  const users = await turso.execute("SELECT * FROM users WHERE username = 'testuser'");
  console.log("✓ Queried user:", users.rows[0]);

  // Cleanup
  await turso.execute("DELETE FROM users WHERE username = 'testuser'");
  console.log("✓ Cleaned up test data");

  console.log("\n🎉 All tests passed!");
}

test().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
