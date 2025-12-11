import { createClient } from "@libsql/client";

export const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});

// Helper to run queries safely
export async function query<T = any>(sql: string, args: any[] = []): Promise<T[]> {
  const result = await turso.execute({ sql, args });
  return result.rows as T[];
}

// Helper to run single insert/update/delete
export async function execute(sql: string, args: any[] = []) {
  return await turso.execute({ sql, args });
}
