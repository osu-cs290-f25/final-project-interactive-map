-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  google_id TEXT UNIQUE,
  github_id TEXT UNIQUE,
  username TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Elden Ring markers
CREATE TABLE IF NOT EXISTS elden_markers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  type TEXT NOT NULL, -- 'Quest', 'Boss', 'Item', 'NPC', 'SiteOfGrace', 'Other'
  title TEXT NOT NULL,
  notes TEXT,
  completed BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Elden Ring drawings
CREATE TABLE IF NOT EXISTS elden_drawings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'path', 'line', 'circle', 'polygon', 'text'
  coordinates TEXT NOT NULL, -- JSON array of [lat, lng] points
  style TEXT NOT NULL, -- JSON: {color, weight, opacity}
  zoom_level REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Earth markers
CREATE TABLE IF NOT EXISTS earth_markers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_elden_markers_user ON elden_markers(user_id);
CREATE INDEX IF NOT EXISTS idx_elden_drawings_user ON elden_drawings(user_id);
CREATE INDEX IF NOT EXISTS idx_earth_markers_user ON earth_markers(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
