import { getAllCourses, getCourseById, addCourse } from '../repositories/coursesRepository.js'
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

app.post('/', (req, res) => {
  const course = {
    name: req.body.name.trim(),
    description: req.body.description.trim(),
  };
  addCourse(course);
  res.redirect('/courses');
});

  app.get('/:id', (req, res) => {
    const course = getCourseById(parseInt(req.params.id));
    if (!course) {
      res.code(404).send('Course not found');
      return;
    }
    res.send(`Course ID: ${course.id}; Name: ${course.name}`);
  });
}
