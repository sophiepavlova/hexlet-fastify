import { getAllCourses, getCourseById, addCourse } from '../repositories/coursesRepository.js'
import RouteHelper from '../RouteHelper.js';
import * as yup from 'yup';

export default async function (app, _options) {
  app.get(RouteHelper.coursesIndex(), (req, res) => {
    db.all('SELECT * FROM courses', (error, data) => {
      const templateData = {
        courses: data,
        error,
      };
      res.view('courses/index', templateData);
    });
  });

  app.get('/:courseId/lessons/:id', (req, res) => {
    const course = getCourseById(parseInt(req.params.courseId));
    if (!course) {
      res.code(404).send('Course not found');
      return;
    }
    res.send(`Course ID: ${course.id}; Lesson ID: ${req.params.id}`);
  });

  // Adding a new course
  app.get(RouteHelper.newCourse(), (req, res) => {
    res.view('courses/new', {
      name: '',
      description: '',
      errors: {},
      routes: RouteHelper,
    });
  });

  app.post(RouteHelper.coursesCreate(), {
    attachValidation: true,
    schema: {
      body: yup.object({
        name: yup.string().min(2, 'Имя должно быть не меньше двух символов').required('Введите имя курса'),
        description: yup.string().min(10, 'Описание не должно быть меньше десяти символов').required('Введите описание курса'),
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

      return res.view('courses/new', {
        name,
        description,
        errors,
        routes: RouteHelper,
      });
    }

    const stmt = db.prepare('INSERT INTO courses(name, description) VALUES (?, ?)');
    stmt.run([name, description], function (error) {
      if (error) {
        const templateData = {
          error,
          course: { name, description },
          routes: RouteHelper,
        };
        res.view('courses/new', templateData);
        return;
      }

      const newCourse = {
        name: name.trim(),
        description: description.trim(),
      };
      console.log('Adding new course:', newCourse);
      addCourse(newCourse);
      console.log('Redirecting to:', RouteHelper.coursesIndex());
      res.redirect(`/courses/${this.lastID}`);
    });
  });

  // Show course details
  app.get(RouteHelper.courseShow(), (req, res) => {
    const id = parseInt(req.params.id);
    const course = getCourseById(id);
    if (!course) {
      res.code(404).send('Course not found');
      return;
    }
    res.view('courses/show', { course });
  });
}
