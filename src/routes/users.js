// routes/users.js
// @ts-check
import { getAllUsers, addUser, getUserById } from '../repositories/usersRepository.js'
import { generateId, crypto } from '../utils.js';

import * as yup from 'yup';


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

  app.post('/', {
    attachValidation: true,
    schema: {
      body: yup.object({
        username: yup.string().min(2, 'Имя должно быть не меньше двух символов').required('Введите имя'),
        email: yup.string().email('Некорректный email').required('Введите email'),
        password: yup.string().min(5, 'Пароль должен быть не менее 5 символов').required('Введите пароль'),
        passwordConfirmation: yup.string()
          .oneOf([yup.ref('password')], 'Пароли не совпадают')
          .required('Подтвердите пароль'),
      }),
    },
    validatorCompiler: ({ schema }) => (data) => {
      try {
        const result = schema.validateSync(data, { abortEarly: false });
        return { value: result };
      } catch (e) {
        return { error: e };
      }
    },
    }, (req, res) => {
    const { username, email, password, passwordConfirmation } = req.body;

    if (req.validationError) {
      const errors = {};
      req.validationError.inner.forEach((err) => {
        errors[err.path] = err.message;
      });

      const data = {
        username,
        email,
        password,
        passwordConfirmation,
        errors,
      };

      console.log(req.body, req.validationError) 
      return res.view('users/new', data);
    }

    const newUser = {
      id: generateId(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: crypto(password),
    };
    console.log('Adding new user:', newUser);
    addUser(newUser);
    res.redirect('/users');
  });



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