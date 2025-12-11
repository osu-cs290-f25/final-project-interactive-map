import { Google, GitHub } from "arctic";
import { query, execute } from "./db";
import { randomBytes } from "crypto";

// OAuth providers
export const google = new Google(
  import.meta.env.GOOGLE_CLIENT_ID,
  import.meta.env.GOOGLE_CLIENT_SECRET,
  import.meta.env.GOOGLE_REDIRECT_URI
);

export const github = new GitHub(
  import.meta.env.GITHUB_CLIENT_ID,
  import.meta.env.GITHUB_CLIENT_SECRET,
  import.meta.env.GITHUB_REDIRECT_URI
);

// Generate secure session ID (replaces oslo)
function generateSessionId(): string {
  return randomBytes(32).toString("hex"); // 256-bit random ID
}

// Session management
export async function createSession(userId: number): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days

  await execute(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
    [sessionId, userId, expiresAt]
  );

  return sessionId;
}

export async function validateSession(sessionId: string) {
  const sessions = await query<{ user_id: number; expires_at: number }>(
    "SELECT user_id, expires_at FROM sessions WHERE id = ?",
    [sessionId]
  );

  if (sessions.length === 0) return null;

  const session = sessions[0];

  // Check if expired
  if (Date.now() >= session.expires_at) {
    await execute("DELETE FROM sessions WHERE id = ?", [sessionId]);
    return null;
  }

  // Return user data
  const users = await query<{ id: number; username: string; avatar_url: string }>(
    "SELECT id, username, avatar_url FROM users WHERE id = ?",
    [session.user_id]
  );

  return users[0] || null;
}

export async function invalidateSession(sessionId: string) {
  await execute("DELETE FROM sessions WHERE id = ?", [sessionId]);
}

// Get or create user
export async function getOrCreateUser(provider: "google" | "github", profile: any) {
  const providerId = provider === "google" ? profile.sub : profile.id;
  const column = provider === "google" ? "google_id" : "github_id";

  // Check if user exists
  const existing = await query<{ id: number }>(
    `SELECT id FROM users WHERE ${column} = ?`,
    [providerId]
  );

  if (existing.length > 0) {
    return existing[0].id;
  }

  // Create new user
  const username = profile.login || profile.email?.split("@")[0] || "User";
  const email = profile.email || null;
  const avatarUrl = profile.picture || profile.avatar_url || null;

  const result = await execute(
    `INSERT INTO users (${column}, username, email, avatar_url) VALUES (?, ?, ?, ?)`,
    [providerId, username, email, avatarUrl]
  );

  return result.lastInsertRowid as number;
}
