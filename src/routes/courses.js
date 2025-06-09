import { getAllCourses, getCourseById, addCourse } from '../repositories/coursesRepository.js'
import * as yup from 'yup';

export default async function (app, _options) {
  app.get('/', (req, res) => {
    const { term = '', description = '' } = req.query;
    
    // Получаем курсы из глобального состояния
    const courses = getAllCourses();

    const coursesFiltered = courses.filter(course => {
      const nameMatches = term === '' || course.name.toLowerCase().includes(term.toLowerCase());
      const descMatches = description === '' || course.description.toLowerCase().includes(description.toLowerCase());
      return nameMatches && descMatches;
    });

    const data = { 
      term, 
      description,
      courses: coursesFiltered
    };

    res.view('courses/index', data);
  });

 app.get('/:courseId/lessons/:id', (req, res) => {
  const course = getCourseById(parseInt(req.params.courseId));
  if (!course) {
    res.code(404).send('Course not found');
    return;
  }
  res.send(`Course ID: ${course.id}; Lesson ID: ${req.params.id}`);
});

//Adding a new course
app.get('/new', (req, res) => {
  res.view('courses/new'); // форма добавления
//   res.send('Course build');
});

app.post('/', {
    attachValidation: true,
    schema: {
      body: yup.object({
        name: yup.string().min(2, 'Имя должно быть не меньше двух символов').required('Введите имя курса'),
        description: yup.string().min(10, 'Описание не должно быть не меньше двух символов').required('Введите описание курса'),
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
    const { name, description } = req.body;

    if (req.validationError) {

      const errors = {};
      req.validationError.inner.forEach((err) => {
        errors[err.path] = err.message;
      });

      const data = {
        name,
        description,
        errors,
      };

     console.log('Ошибки валидации:', errors);
    return res.view('courses/new', data);
    }

    const newCourse = {
      name: name.trim(),
      description: description.trim(),
    };
    console.log('Adding new course:', newCourse);
    addCourse(newCourse);
    res.redirect('/courses');
  });

// app.post('/', (req, res) => {
//   const course = {
//     name: req.body.name.trim(),
//     description: req.body.description.trim(),
//   };
//   addCourse(course);
//   res.redirect('/courses');
// });

  app.get('/:id', (req, res) => {
    const course = getCourseById(parseInt(req.params.id));
    if (!course) {
      res.code(404).send('Course not found');
      return;
    }
    res.send(`Course ID: ${course.id}; Name: ${course.name}`);
  });
}
