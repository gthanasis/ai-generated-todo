const TodoService = require('../src/todo.service');
const ToDo = require('../src/todo.model');

jest.mock('../src/todo.model', () => ({
    generate: jest.fn(({ title, description }) => ({
        id: 'mocked-id',
        title,
        description,
        completed: false,
        createdAt: new Date(),
    })),
}));

describe('TodoService', () => {
    let mockRepo, service;

    beforeEach(() => {
        // Mock the repository methods
        mockRepo = {
            create: jest.fn(),
            read: jest.fn(),
            readAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        service = new TodoService(mockRepo);
        jest.clearAllMocks();
    });

    test('should create a todo', () => {
        const mockTodo = { id: 'mocked-id', title: 'Test Todo', description: 'Test Description' };
        mockRepo.create.mockReturnValue(mockTodo);

        const todo = service.createTodo({ title: 'Test Todo', description: 'Test Description' });

        expect(todo).toEqual(expect.objectContaining(mockTodo));
        expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
            id: 'mocked-id',
            title: 'Test Todo',
            description: 'Test Description',
        }));
        expect(ToDo.generate).toHaveBeenCalledWith({ title: 'Test Todo', description: 'Test Description' });
    });

    test('should throw an error when creating a todo without title', () => {
        expect(() => service.createTodo({ description: 'No Title' })).toThrow('Title is required');
        expect(mockRepo.create).not.toHaveBeenCalled();
    });

    test('should retrieve a todo by ID', () => {
        const mockTodo = { id: '1', title: 'Existing Todo', description: 'Exists' };
        mockRepo.read.mockReturnValue(mockTodo);

        const retrievedTodo = service.getTodoById({ id: '1' });

        expect(retrievedTodo).toEqual(mockTodo);
        expect(mockRepo.read).toHaveBeenCalledWith('1');
    });

    test('should throw an error when retrieving a todo with missing ID', () => {
        expect(() => service.getTodoById({})).toThrow('ID is required');
        expect(mockRepo.read).not.toHaveBeenCalled();
    });

    test('should throw an error when retrieving a non-existent todo', () => {
        mockRepo.read.mockReturnValue(null);

        expect(() => service.getTodoById({ id: '999' })).toThrow('Todo with ID 999 not found');
        expect(mockRepo.read).toHaveBeenCalledWith('999');
    });

    test('should list all todos', () => {
        const mockTodos = [
            { id: '1', title: 'Todo 1', description: 'First' },
            { id: '2', title: 'Todo 2', description: 'Second' },
        ];
        mockRepo.readAll.mockReturnValue(mockTodos);

        const todos = service.listTodos({});

        expect(todos).toEqual(mockTodos);
        expect(mockRepo.readAll).toHaveBeenCalled();
    });

    test('should filter todos by text search', () => {
        const mockTodos = [
            { id: '1', title: 'Buy milk', description: 'Groceries' },
            { id: '2', title: 'Do laundry', description: 'Weekend chores' },
        ];
        mockRepo.readAll.mockReturnValue(mockTodos);

        const filteredTodos = service.listTodos({ textSearch: 'milk' });

        expect(filteredTodos.length).toBe(1);
        expect(filteredTodos[0].title).toBe('Buy milk');
        expect(mockRepo.readAll).toHaveBeenCalled();
    });

    test('should update an existing todo', () => {
        const mockTodo = { id: '1', title: 'Old Title', description: 'Old Description' };
        const updatedTodo = { id: '1', title: 'New Title', description: 'Old Description' };
        mockRepo.read.mockReturnValue(mockTodo);
        mockRepo.update.mockReturnValue(updatedTodo);

        const result = service.updateTodo({ id: '1', updates: { title: 'New Title' } });

        expect(result).toEqual(updatedTodo);
        expect(mockRepo.read).toHaveBeenCalledWith('1');
        expect(mockRepo.update).toHaveBeenCalledWith('1', { title: 'New Title' });
    });

    test('should throw an error when updating a non-existent todo', () => {
        mockRepo.read.mockReturnValue(null);

        expect(() => service.updateTodo({ id: '999', updates: { title: 'Does not exist' } }))
            .toThrow('Todo with ID 999 not found');
        expect(mockRepo.read).toHaveBeenCalledWith('999');
        expect(mockRepo.update).not.toHaveBeenCalled();
    });

    test('should delete an existing todo', () => {
        mockRepo.delete.mockReturnValue(true);

        const result = service.deleteTodo({ id: '1' });

        expect(result).toEqual({ success: true });
        expect(mockRepo.delete).toHaveBeenCalledWith('1');
    });

    test('should throw an error when deleting a non-existent todo', () => {
        mockRepo.delete.mockReturnValue(false);

        expect(() => service.deleteTodo({ id: '999' })).toThrow('Todo with ID 999 not found');
        expect(mockRepo.delete).toHaveBeenCalledWith('999');
    });
});
