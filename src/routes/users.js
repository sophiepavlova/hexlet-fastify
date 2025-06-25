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
    const messages = res.flash(); // ← get flash messages from session
    console.log('Flash messages raw:', messages);

    res.render('users/index', {
      users,
      routes: RouteHelper, // это добавит в шаблон объект маршрутов
      messages, 
    })
  })

  app.get('/test-flash', (req, res) => {
    req.flash('success', 'Тестовое сообщение');
    res.redirect(RouteHelper.usersIndex());
  });

  app.get('/flash-set', (req, res) => {
  req.flash('success', 'Сообщение для проверки');
  res.redirect('/flash-show');
});

app.get('/flash-show', (req, res) => {
  const messages = res.flash();
  console.log('Flash messages:', messages);
  res.send(messages);
});

  // Get a new user form 
  app.get(RouteHelper.newUser(), (req, res) => {
    res.render('users/new', {
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
      
      return res.render('users/new', data);
    }

    try {
      const newUser = {
        id: generateId(),
        username: username.trim(),
        name: username.trim(),
        email: email.trim().toLowerCase(),
        password: crypto(password),
      };

      addUser(newUser);
      console.log('User added:', newUser);
      req.flash('success', 'Пользователь зарегистрирован');
    } catch (e) {
      req.flash('error', 'Ошибка регистрации');
    }

    console.log('Setting flash and redirecting...');
    console.log('Flash (success):', req.session.flash);

    return res.redirect(RouteHelper.usersIndex());
  });


  app.get(RouteHelper.userShow(), (req, res) => {
    const id = parseInt(req.params.id);
    const user =  getUserById(id);
    if (!user) {
      res.code(404).send('User not found');
      return;
    }
    const messages = res.flash(); // Получаем flash-сообщения
    console.log('На странице u/:id сообщения:', messages);
    res.render('users/show', { user, messages });
  });

  app.get(RouteHelper.userPost(), (req, res) => {
    const { id, postId } = req.params;
    res.send(`User ID: ${id}; Post ID: ${postId}`);
  });

  app.get('/session/new', (req, res) => {
    res.render('users/login')  
  })

  app.post('/session', (req, res) => {
    const { email, password } = req.body;
    const passwordDigest = encrypt(password);
    console.log('Login attempt:', { email, passwordDigest });
    const users = getAllUsers();

    const user = users.find((u) => {
      console.log(`users password: ${u.password}, input password: ${passwordDigest}`);
      return u.email === email && encrypt(u.password) === passwordDigest;
    });
    if (!user) {
      return res.render('users/login', {
        error: 'Неверный email или пароль',
        email, // чтобы пользователь не вводил заново
      });
    }

    req.session.userId = user.id;
    req.flash('success', 'Добро пожаловать, ' + user.name);
    console.log('Перед редиректом /u/:id — flash:', req.session.flash);
    res.redirect(`${RouteHelper.usersPrefix}/${user.id}`)
  });

}
