export default class RouteHelper {
  // Префиксы
  static get usersPrefix() {
    return '/u';
  }

  static get coursesPrefix() {
    return '/courses';
  }

  // Users
  static usersIndex() {
    return this.usersPrefix;          // /u
  }

  static newUser() {
    return `${this.usersPrefix}/new`; // /u/new
  }

  static usersCreate() {
    return this.usersPrefix;          // /u
  }

  static userShow(id = ':id') {
    return `${this.usersPrefix}/${id}`; // /u/:id
  }

  static userPost(id = ':id', postId = ':postId') {
    return `${this.usersPrefix}/${id}/post/${postId}`; // /u/:id/post/:postId
  }

  // Courses
  static coursesIndex() {
    return this.coursesPrefix;         // /courses
  }

  static newCourse() {
    return `${this.coursesPrefix}/new`; // /courses/new
  }

  static coursesCreate() {
    return this.coursesPrefix;         // /courses
  }

  static courseShow(id = ':id') {
    return `${this.coursesPrefix}/${id}`; // /courses/:id
  }

  static courseLesson(courseId = ':courseId', lessonId = ':id') {
    return `${this.coursesPrefix}/${courseId}/lessons/${lessonId}`; // /courses/:courseId/lessons/:id
  }

  // Главная страница (root)
  static root() {
    return '/';
  }
}
