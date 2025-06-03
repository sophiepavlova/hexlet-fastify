import fastify from 'fastify'
import view from '@fastify/view'
import pug from 'pug'
import path from 'path'
import { fileURLToPath } from 'url'

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

// Подключаем pug через плагин и указываем папку с шаблонами
await app.register(view, {
  engine: { pug },
  root: path.join(__dirname, 'views'), // Путь к папке с шаблонами
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
