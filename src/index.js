const InMemoryRepository = require('./in-memory.repository');
const TodoService = require('./todo.service');

const repository = new InMemoryRepository();
const todoService = new TodoService(repository);

// Create Todos
const todo1 = todoService.createTodo({ title: 'Learn JavaScript', description: 'Study ES6+' });
const todo2 = todoService.createTodo({ title: 'Build a project', description: 'Use React.js' });

console.log('Created Todos:');
console.log(todo1, todo2);

// List Todos
console.log('All Todos:');
const list = todoService.listTodos({})
console.log(list);

// Search Todos
console.log('Search Todos (textSearch = "React"):');
console.log(todoService.listTodos({ textSearch: 'React' }));

// Update Todo
console.log('Updated Todo:');
console.log(todoService.updateTodo({ id: todo1.id, updates: { completed: true } }));

// Delete Todo
console.log('Deleting Todo:');
console.log(todoService.deleteTodo({ id: todo2.id }));

// List Todos after Deletion
console.log('Todos After Deletion:');
console.log(todoService.listTodos({}));
