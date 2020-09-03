const express = require('express');
const server = express();

// import other files here using require syntax
const postsRouter = require('./posts/posts-router')

server.use(express.json());

server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
    res.send('we good')
})

server.listen(8000, () => {
    console.log("welcome to servertown")
})