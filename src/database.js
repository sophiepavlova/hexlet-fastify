import sqlite3 from 'sqlite3'

const db = new sqlite3.Database(':memory:')

export const prepareDatabase = () => {
  db.serialize(() => {
    // Создаём таблицу courses
    db.run(`
      CREATE TABLE courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT
      );
    `);

    const courses = [
      { name: 'JavaScript', description: 'Курс по языку программирования JavaScript' },
      { name: 'Advanced CSS', description: 'Styling like a pro' },
      { name: 'Fastify', description: 'Курс по фреймворку Fastify' },
    ];

    const courseStmt = db.prepare('INSERT INTO courses(name, description) VALUES (?, ?)');
    courses.forEach(({ name, description }) => {
      courseStmt.run(name, description);
    });
    courseStmt.finalize();

    // ⬇️ Создаём таблицу users
    db.run(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    const users = [
      { name: 'Alice', email: 'alice@example.com', password: '123' },
      { name: 'Bob', email: 'bob@example.com', password: '456' },
    ];

    const userStmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    users.forEach(({ name, email, password }) => {
      userStmt.run(name, email, password);
    });
    userStmt.finalize();
  });
};

export default db
