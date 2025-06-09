const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', password: '123' },
  { id: 2, name: 'Bob', email: 'bob@example.com', password: '456' },
  // Можно добавить начальных пользователей
]

export function getAllUsers() {
  return users
}

export function addUser(user) {
  user.id = users.length + 1
  users.push(user)
}

export function getUserById(id) {
  return users.find(u => u.id === id)
}

