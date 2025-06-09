// src/utils.js
let lastId = 0;

export function generateId() {
  lastId += 1;
  return lastId;
}

export function crypto(password) {
  // Временное "шифрование" пароля (только для имитации)
  return `hashed_${password}`;
}
