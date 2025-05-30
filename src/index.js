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


app.listen({ port }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on http://localhost:${port}`);
});
