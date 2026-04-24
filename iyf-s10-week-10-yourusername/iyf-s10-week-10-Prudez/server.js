require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`Running in ${NODE_ENV} mode`);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});