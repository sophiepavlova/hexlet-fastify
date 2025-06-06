import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'
import path from 'path'
import { fileURLToPath } from 'url'
import sanitize from 'sanitize-html'
import formbody from '@fastify/formbody'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();
const port = 3000;
await app.register(formbody)

app.decorate('state', {
  users: [],
  courses: [],
})

import usersRoutes from './routes/users.js'
await app.register(usersRoutes, { prefix: '/users' })
import coursesRoutes from './routes/courses.js'
await app.register(coursesRoutes, { prefix: '/courses' })
import rootRoutes from './routes/root.js'
await app.register(rootRoutes, { prefix: '/' })

// Данные пользователей (состояние)
const state = {
  users: [
    { id: 1, username: 'user1', email: 'user1@example.com' },
    { id: 2, username: 'user2', email: 'user2@example.com' },
  ],
};

const courses = [
  { id: 1, name: 'JavaScript Basics', description: 'Learn JS fundamentals' },
  { id: 2, name: 'Advanced CSS', description: 'Styling like a pro' },
  { id: 3, name: 'Fastify', description: 'Web development with Fastify' },
];

// Подключаем pug через плагин и указываем папку с шаблонами
await app.register(view, {
  engine: { pug },
  root: path.join(__dirname, 'views'), // Путь к папке с шаблонами
});


// Пример уязвимости XSS
// app.get('/xss/:id', (req, res) => {
//   res.type('html');
//   res.send(`<h1>${req.params.id}</h1>`);
// });
//http://localhost:3000/xss/%3Cscript%3Ealert('attack!')%3B%3C%2Fscript%3E

// // Пример  without уязвимости XSS
app.get('/xss/:id', (req, res) => {
  res.type('html');
  // const escapedId = sanitize(req.params.id)
  const escapedId = sanitize(req.params.id, { allowedTags: [], allowedAttributes: {} });

  // res.send(`<h1>${escapedId}</h1>`);
  res.send(`<pre>${escapedId}</pre>`);
});



// Другие маршруты
app.get('/hello', (req, res) => {
  const name = req.query.name;
  if (!name) {
    res.send('Hello, World!');
  } else {
    res.send(`Hello, ${name}!`);
  }
});

app.listen({ port }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on http://localhost:${port}`);
});
