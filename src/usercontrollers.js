const store = require('../data/store');

const getAllUsers = (req, res) => {
    res.json(store.users);
};

const createUser = (req, res) => {
    const { name, email } = req.body;

    const newUser = {
        id: store.nextId++,
        name,
        email
    };

    store.users.push(newUser);
    res.status(201).json(newUser);
};

module.exports = {
    getAllUsers,
    createUser
};