const ToDo = require('./todo.model');

class TodoService {
    constructor(storage) {
        this.storage = storage;
    }

    createTodo({ title, description }) {
        if (!title) {
            throw new Error('Title is required');
        }
        const todo = ToDo.generate({ title, description });
        return this.storage.create(todo);
    }

    getTodoById({ id }) {
        if (!id) {
            throw new Error('ID is required');
        }
        const todo = this.storage.read(id);
        if (!todo) {
            throw new Error(`Todo with ID ${id} not found`);
        }
        return todo;
    }

    listTodos({ textSearch = '' } = {}) {
        const todos = this.storage.readAll();
        if (textSearch) {
            return todos.filter(
                (todo) =>
                    todo.title.includes(textSearch) || (todo.description && todo.description.includes(textSearch))
            );
        }
        return todos;
    }

    updateTodo({ id, updates }) {
        if (!id) {
            throw new Error('ID is required');
        }
        const todo = this.storage.read(id);
        if (!todo) {
            throw new Error(`Todo with ID ${id} not found`);
        }
        const updatedTodo = this.storage.update(id, updates);
        return updatedTodo;
    }

    deleteTodo({ id }) {
        if (!id) {
            throw new Error('ID is required');
        }
        const success = this.storage.delete(id);
        if (!success) {
            throw new Error(`Todo with ID ${id} not found`);
        }
        return { success: true };
    }
}

module.exports = TodoService;
