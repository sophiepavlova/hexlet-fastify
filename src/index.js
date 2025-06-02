import fastify from 'fastify';

const app = fastify();
const port = 3000;

app.get('/', (request, reply) => {
   console.log('GET /users route called');
  reply.send('Welcome to Hexlet!');
});

app.post('/users', (request, reply) => {
  console.log('POST /users route called');
  reply.send('POST /users');
});

app.get('/users', (request, reply) => {
  reply.send('GET /users');
});

app.get('/hello', (request, reply) => {
  const name = request.query.name;
  if(!name){
    reply.send('Hello, World!');
  } else reply.send(`Hello, ${name}!`);
});

// app.get('/courses/:id', (req, res) => {
//   res.send(`Course ID: ${req.params.id}`)
// })

// app.get('/users/:id', (req, res) => {
//   res.send(`User ID: ${req.params.id}`)
// })

const state = {
  users: [
    {
      id: 1,
      name: 'user',
    },
  ],
}

// app.get('/users/:id', (req, res) => {
//   const { id } = req.params
//   const user = state.users.find(user => user.id === parseInt(id))
//   if (!user) {
//     res.code(404).send({ message: 'User not found' })
//   }
//   else {
//     res.send(user)
//   }
// })

app.get('/courses/:courseId/lessons/:id', (req, res) => {
  res.send(`Course ID: ${req.params.courseId}; Lesson ID: ${req.params.id}`)
})

// app.get('/users/:id/post/:postId', (req, res) => {
//   res.send(`User ID: ${req.params.id}; Post ID: ${req.params.postId}`)
// })

app.get('/users/:id/post/:postId', (req, res) => {
  const { id, postId } = req.params;
  res.send(`User ID: ${id}; Post ID: ${postId}`);
});


// users/{id}/post/{postId}
app.get('/courses/new', (req, res) => {
  res.send('Course build')
})

app.get('/courses/:id', (req, res) => {
  res.send(`Course ID: ${req.params.id}`)
})


app.listen({ port }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on http://localhost:${port}`);
});
