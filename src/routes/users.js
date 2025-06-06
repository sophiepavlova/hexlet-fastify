// routes/users.js
// @ts-check
import { getAllUsers, addUser, getUserById } from '../repositories/usersRepository.js'

export default async function (app, _options) {

// getAllUsers
 app.get('/', (req, res) => {
    const users = getAllUsers()
    res.view('users/index', { users })
  })

  //Get a new user form 
  app.get('/new', (req, res) => {
  res.view('users/new')
})

app.post('/', (req, res) => {
  const user = {
    name: req.body.name.trim(),
    email: req.body.email.trim().toLowerCase(),
    password: req.body.password,
  }

  addUser(user)
  res.redirect('/users')
})


app.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user =  getUserById(id)
  if (!user) {
    res.code(404).send('User not found');
    return;
  }
  res.view('users/show', { user });
});


app.get('/:id/post/:postId', (req, res) => {
  const { id, postId } = req.params;
  res.send(`User ID: ${id}; Post ID: ${postId}`);
});
}