// TASK 20.1
const express = require('express');
const app = express();

// ======================
// Exercise 1: Custom Middleware
// ======================

const logger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
};

const addRequestTime = (req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
};

app.use(logger);
app.use(addRequestTime);

// ======================
// Exercise 2: Built-in Middleware
// ======================

// Parse JSON
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// ======================
// Exercise 3: Route-specific Middleware
// ======================

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
    }

    next();
};

// ======================
// Routes
// ======================

app.get('/api/time', (req, res) => {
    res.json({ requestTime: req.requestTime });
});

app.get('/api/protected', requireAuth, (req, res) => {
    res.json({ message: 'This is protected data' });
});

app.use('/api/admin', requireAuth);

app.get('/api/admin/dashboard', (req, res) => {
    res.json({ message: 'Admin dashboard' });
});

// ======================
// Start server
// ======================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// TASK 20.2

// ======================
// Exercise 1: Error Handling
// ======================

class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

app.get('/api/error-test', (req, res, next) => {
    try {
        throw new ApiError('Something went wrong', 500);
    } catch (error) {
        next(error); 
    }
});

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const fetchUsers = async () => {

    throw new ApiError('Failed to fetch users', 500);
};

app.get('/api/users', asyncHandler(async (req, res) => {
    const users = await fetchUsers();
    res.json(users);
}));

// ======================
// Exercise 2: Validation Middleware
// ======================

const validatePost = (req, res, next) => {
    const { title, content, author } = req.body;
    const errors = [];

    if (!title || title.length < 3) {
        errors.push('Title must be at least 3 characters');
    }

    if (!content || content.length < 10) {
        errors.push('Content must be at least 10 characters');
    }

    if (!author) {
        errors.push('Author is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

app.post('/api/posts', validatePost, (req, res) => {
    res.json({
        message: 'Post created successfully',
        data: req.body
    });
});

// ======================
// ERROR HANDLING MIDDLEWARE 
// ======================

app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            message,
            status: statusCode
        }
    });
});