import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'
import path from 'path'
import { fileURLToPath } from 'url'
import sanitize from 'sanitize-html'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();
const port = 3000;

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

app.get('/courses', (req, res) => {
  const { term = '', description = ''}  = req.query
  
    const coursesFiltered = courses.filter(course => {
      const nameMatches = term === '' || course.name.toLowerCase().includes(term.toLowerCase());
      const descMatches = description === '' || course.description.toLowerCase().includes(description.toLowerCase());
      return nameMatches && descMatches;
    }
    );
  

  const data = { 
    term, 
    description,
    courses: coursesFiltered }

  res.view('courses/index', data)
})

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

// Главная страница — рендерит users/index.pug и передаёт users
app.get('/', (req, res) => {
  res.view('users/index', { users: state.users });
});

// Пример POST-запроса
app.post('/users', (req, res) => {
  res.send('POST /users');
});

// Пример параметризированного маршрута
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = state.users.find(u => u.id === id);
  if (!user) {
    res.code(404).send('User not found');
    return;
  }
  res.view('users/show', { user });
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

app.get('/courses/:courseId/lessons/:id', (req, res) => {
  res.send(`Course ID: ${req.params.courseId}; Lesson ID: ${req.params.id}`);
});

app.get('/users/:id/post/:postId', (req, res) => {
  const { id, postId } = req.params;
  res.send(`User ID: ${id}; Post ID: ${postId}`);
});

app.get('/courses/new', (req, res) => {
  res.send('Course build');
});

app.get('/courses/:id', (req, res) => {
  res.send(`Course ID: ${req.params.id}`);
});

app.listen({ port }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on http://localhost:${port}`);
});
