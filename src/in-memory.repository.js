class InMemoryRepository {
    constructor() {
        this.data = new Map();
    }

    create(item) {
        this.data.set(item.id, item);
        return item;
    }

    read(id) {
        return this.data.get(id) || null;
    }

    readAll() {
        return Array.from(this.data.values());
    }

    update(id, updates) {
        const item = this.data.get(id);
        if (!item) return null;
        const updatedItem = { ...item, ...updates };
        this.data.set(id, updatedItem);
        return updatedItem;
    }

    delete(id) {
        return this.data.delete(id);
    }
}

module.exports = InMemoryRepository;
