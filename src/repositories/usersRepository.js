import db from '../database.js';

// Получить всех пользователей
export function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Добавить нового пользователя
export function addUser({ name, email, password }) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    stmt.run(name, email, password, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, name, email, password });
    });
    stmt.finalize();
  });
}

// Найти пользователя по ID
export function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', id, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}
