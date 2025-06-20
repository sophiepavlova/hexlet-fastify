// @ts-check
import { getAllUsers, addUser, getUserById } from '../repositories/usersRepository.js'
import { generateId, crypto } from '../utils.js';
import RouteHelper from '../RouteHelper.js';
import * as yup from 'yup';
import encrypt from '../encrypt.js';


export default async function (app, _options) {

  // getAllUsers
 app.get(RouteHelper.usersIndex(), (req, res) => {
  const users = getAllUsers()
  res.view('users/index', {
    users,
    routes: RouteHelper, // 👈 это добавит в шаблон объект маршрутов
  })
})


  //Get a new user form 
  app.get(RouteHelper.newUser(), (req, res) => {
    res.view('users/new', {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: {},
      routes: RouteHelper,
    })
  })

  app.post(RouteHelper.usersCreate(), {
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
        routes: RouteHelper, 
      };

      console.log(req.body, req.validationError) 
      // res.view(RouteHelper.newUser(), { routes: RouteHelper });
      // res.view(RouteHelper.newUser(), { ...data, routes: RouteHelper });
      return res.view('users/new', { ...data, routes: RouteHelper })
    }

    const newUser = {
      id: generateId(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: crypto(password),
    };
    console.log('Adding new user:', newUser);
    addUser(newUser);
    res.redirect(RouteHelper.usersIndex());
    // res.redirect('/users');
  });

  app.get(RouteHelper.userShow(), (req, res) => {
    const id = parseInt(req.params.id);
    const user =  getUserById(id)
    if (!user) {
      res.code(404).send('User not found');
      return;
    }
    res.view('users/show', { user });
  });

app.get(RouteHelper.userPost(), (req, res) => {
  const { id, postId } = req.params;
  res.send(`User ID: ${id}; Post ID: ${postId}`);
});

app.get('/session/new', (req, res) => {
  res.view('users/login')  
})

app.post('/session', (req, res) => {
  const { email, password } = req.body;
  const passwordDigest = encrypt(password);
  console.log('Login attempt:', { email, passwordDigest });
  const users = getAllUsers();

  const user = users.find((u) => {
    console.log(`users password: ${u.password}, input password: ${passwordDigest}`);
   return u.email === email &&  encrypt(u.password) === passwordDigest
});
  if (!user) {
    return res.view('users/login', {
      error: 'Неверный email или пароль',
      email, // чтобы пользователь не вводил заново
    });
  }

  req.session.userId = user.id;
  res.redirect(`${RouteHelper.usersPrefix}/${user.id}`)
});

}
