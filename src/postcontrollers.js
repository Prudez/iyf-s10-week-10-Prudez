const store = require('../data/store');

const getAllPosts = (req, res) => {
    res.json(store.posts);
};

const getPostById = (req, res) => {
    const post = store.posts.find(p => p.id === parseInt(req.params.id));

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
};

const createPost = (req, res) => {
    const { title, content, author } = req.body;

    const newPost = {
        id: store.nextId++,
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
        likes: 0
    };

    store.posts.push(newPost);
    res.status(201).json(newPost);
};

// ✅ UPDATE
const updatePost = (req, res) => {
    const post = store.posts.find(p => p.id === parseInt(req.params.id));

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const { title, content, author } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (author) post.author = author;

    res.json(post);
};

// ✅ DELETE
const deletePost = (req, res) => {
    const index = store.posts.findIndex(p => p.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const deletedPost = store.posts.splice(index, 1);

    res.json({
        message: 'Post deleted',
        data: deletedPost[0]
    });
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};