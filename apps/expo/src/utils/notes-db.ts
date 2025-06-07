import * as SQLite from "expo-sqlite";

export type Note = {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

const db = SQLite.openDatabase("everynote.db");

// Initialize the Notes table
export async function initDB() {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Notes (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT,
          content TEXT,
          category TEXT,
          createdAt TEXT,
          updatedAt TEXT
        );`,
        [],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// Insert a new note
export async function insertNote(note: Note) {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Notes (id, title, content, category, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?);`,
        [note.id, note.title, note.content, note.category, note.createdAt, note.updatedAt],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// Update an existing note
export async function updateNote(note: Note) {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE Notes SET title = ?, content = ?, category = ?, updatedAt = ? WHERE id = ?;`,
        [note.title, note.content, note.category, note.updatedAt, note.id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// Fetch all notes
export async function fetchNotes(): Promise<Note[]> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Notes ORDER BY updatedAt DESC;`,
        [],
        (_, { rows }) => resolve(rows._array as Note[]),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// Delete a note by ID
export async function deleteNote(id: string) {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM Notes WHERE id = ?;`,
        [id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
} 