const express = require('express');
const db = require('./data/db');

const postRoutes = require('./posts/postsRoutes');
const server = express();

server.use('/api/posts', postRoutes);

server.listen(4002, () => console.log('Server listening on port 4002'));