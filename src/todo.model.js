class ToDo {
    static generate({ id = ToDo.generateRandomId(), title, description = '', completed = false }) {
        return {
            id,
            title,
            description,
            completed,
            createdAt: new Date(),
        };
    }

    static generateRandomId() {
        return Math.random().toString(36).substr(2, 9); // Generates a random alphanumeric string
    }
}

module.exports = ToDo;
