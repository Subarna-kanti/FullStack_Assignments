/*
  Implement a class `Todo` having below methods
    - add(todo): adds todo to list of todos
    - remove(indexOfTodo): remove todo from list of todos
    - update(index, updatedTodo): update todo at given index
    - getAll: returns all todos
    - get(indexOfTodo): returns todo at given index
    - clear: deletes all todos

  Once you've implemented the logic, test your code by running
*/

class Todo {
  constructor() {
    this.result = []
  }

  add(todo) {
    this.result.push(todo)
  }

  remove(idx) {
    this.result.splice(idx, 1)
  }

  update(idx, new_todo) {
    if (idx >= 0 && idx < this.result.length) {
      this.result[idx] = new_todo
    }
  }

  getAll() {
    return this.result
  }

  get(idx) {
    if (idx >= 0 && idx < this.result.length) {
      return this.result[idx]
    }
    return null
  }

  clear() {
    this.result = []
  }
}

module.exports = Todo;
