import sqlite3 from 'sqlite3'

const db = new sqlite3.Database(':memory:')

export const prepareDatabase = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT
      );
    `)

    const courses = [
      { title: 'JavaScript', description: 'Курс по языку программирования JavaScript' },
      { title: 'Fastify', description: 'Курс по фреймворку Fastify' },
    ]

    const stmt = db.prepare('INSERT INTO courses(title, description) VALUES (?, ?)')

    courses.forEach(({ title, description }) => {
      stmt.run(title, description)
    })

    stmt.finalize()
  })
}

export default db
