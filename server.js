const express = require('express');
const app = express();
app.use(express.json());
const PORT = 3000;


let posts = [
    { 
        id: 1, 
        title: "Getting Started with Node.js", 
        content: "Node.js is a JavaScript runtime...",
        author: "John Doe",
        createdAt: "2026-01-15T10:00:00Z",
        likes: 10
    },
    { 
        id: 2, 
        title: "Express.js Fundamentals", 
        content: "Express is a web framework...",
        author: "Jane Smith",
        createdAt: "2026-01-16T14:30:00Z",
        likes: 15
    }
];

let nextId = 1;

// GET all posts
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// GET single post
app.get('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
});

// CREATE post
app.post('/api/posts', (req, res) => {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
        return res.status(400).json({
            error: 'Title, content, and author are required'
        });
    }

    const newPost = {
        id: nextId++,
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
        likes: 0
    };

    posts.push(newPost);
    res.status(201).json(newPost);
});

// UPDATE post
app.put('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const { title, content } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;

    post.updatedAt = new Date().toISOString();

    res.json(post);
});

// DELETE post
app.delete('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    posts.splice(index, 1);
    res.status(204).send();
});

// LIKE post
app.patch('/api/posts/:id/like', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    post.likes++;
    res.json(post);
});z