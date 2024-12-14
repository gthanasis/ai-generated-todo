const InMemoryRepository = require('../src/in-memory.repository');

describe('InMemoryRepository', () => {
    let repo;

    beforeEach(() => {
        repo = new InMemoryRepository();
    });

    test('should create and retrieve an item', () => {
        const item = { id: '1', name: 'Test Item' };
        repo.create(item);
        const retrievedItem = repo.read('1');
        expect(retrievedItem).toEqual(item);
    });

    test('should return null for non-existent item', () => {
        const retrievedItem = repo.read('999');
        expect(retrievedItem).toBeNull();
    });

    test('should return all items', () => {
        repo.create({ id: '1', name: 'Item 1' });
        repo.create({ id: '2', name: 'Item 2' });
        const allItems = repo.readAll();
        expect(allItems.length).toBe(2);
        expect(allItems).toEqual([
            { id: '1', name: 'Item 1' },
            { id: '2', name: 'Item 2' },
        ]);
    });

    test('should update an existing item', () => {
        const item = { id: '1', name: 'Initial Item' };
        repo.create(item);
        const updatedItem = repo.update('1', { name: 'Updated Item' });
        expect(updatedItem).toEqual({ id: '1', name: 'Updated Item' });
        const retrievedItem = repo.read('1');
        expect(retrievedItem).toEqual(updatedItem);
    });

    test('should return null when updating non-existent item', () => {
        const updatedItem = repo.update('999', { name: 'Does Not Exist' });
        expect(updatedItem).toBeNull();
    });

    test('should delete an existing item', () => {
        const item = { id: '1', name: 'Item to Delete' };
        repo.create(item);
        const deleteResult = repo.delete('1');
        expect(deleteResult).toBe(true);
        const retrievedItem = repo.read('1');
        expect(retrievedItem).toBeNull();
    });

    test('should return false when deleting non-existent item', () => {
        const deleteResult = repo.delete('999');
        expect(deleteResult).toBe(false);
    });
});
