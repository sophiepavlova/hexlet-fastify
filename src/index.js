import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import session from '@fastify/session'
import flash from '@fastify/flash'
import fastifyStatic from '@fastify/static'

// import crypto from 'crypto';

import sqlite3 from 'sqlite3'
import view from '@fastify/view'
import pug from 'pug'
import path from 'path'
import { fileURLToPath } from 'url'
import sanitize from 'sanitize-html'
import formbody from '@fastify/formbody'
import * as yup from 'yup';
import db, { prepareDatabase } from './database.js'

prepareDatabase()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();
const port = 3000;

app.register(fastifyStatic, {
  root: path.join(__dirname, '../node_modules/bootstrap/dist/css'),
  prefix: '/assets/',
})

await app.register(fastifyCookie)
await app.register(session, {
  secret: 'a secret with minimum length of 32 characters', // можно заменить на что-то получше
  cookie: { secure: false },
})
await app.register(flash)
await app.register(formbody)
// Подключаем pug через плагин и указываем папку с шаблонами
console.log('VIEWS PATH:', path.join(__dirname, './views'))

await app.register(view, {
  engine: { pug },
  root: path.join(__dirname, './views'),
});
// await app.register(view, {
//   engine: { pug },
//   root: path.join(__dirname, 'views'), // Путь к папке с шаблонами
// });

app.decorateReply('render', function(viewName, data) {
  const flash = this.flash();
  const finalData = { ...data, flash };
  return this.view(viewName, finalData);
});


import usersRoutes from './routes/users.js'
await app.register(usersRoutes)
// await app.register(usersRoutes, { prefix: '/users' })
import coursesRoutes from './routes/courses.js'
await app.register(coursesRoutes)
// await app.register(coursesRoutes, { prefix: '/courses' })
import rootRoutes from './routes/root.js'
await app.register(rootRoutes)
// await app.register(rootRoutes, { prefix: '/' })


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

app.get('/cookies', (req, res) => {
  console.log(req.cookies)

  res.send()
})

app.get('/coolcookie', (req, res) => {
  res.cookie('test', 'value')
  // res.send('Hi! Cookie set.')
  res.send(`req.cookies: ${JSON.stringify(req.cookies)}`)
})

app.get('/start', (req, res) => {
  const visited = req.cookies.visited
  const templateData = {
    visited,
  }
  res.cookie('visited', true)

  res.render('index', templateData)
})

app.get('/increment', (req, res) => {
  req.session.counter = req.session.counter || 0
  req.session.counter += 1
})

app.listen({ port }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on http://localhost:${port}`);
});
