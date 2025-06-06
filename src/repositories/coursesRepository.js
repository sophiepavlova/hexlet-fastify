const courses = [
  { id: 1, name: 'JavaScript Basics', description: 'Learn JS fundamentals' },
  { id: 2, name: 'Advanced CSS', description: 'Styling like a pro' },
  { id: 3, name: 'Fastify', description: 'Web development with Fastify' },
]

export function getAllCourses() {
  return courses
}

export function addCourse(course) {
  course.id = courses.length + 1
  courses.push(course)
}

export function getCourseById(id) {
  return courses.find(c => c.id === id)
}