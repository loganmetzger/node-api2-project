const express = require("express")

const router = express.Router()
const Posts = require('../data/db')

router.get("/", (req, res) => {
    Posts.find()
        .then(Posts => {
            res.status(200).json({ data: Posts })
        })
        .catch(err => {
            res.status(500).json({ err: 'we fucked up'})
        })
})

router.get("/:id", (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            {post ? res.status(200).json({ data: post }) : res.status(404).json({ err: 'shit not here bro'})}
        })
        .catch(err => {
            res.status(500).json({ err: 'we fucked up'})
        })
})

router.get("/:id/comments", (req, res) => {
    const id = req.params.id;
    Posts.findPostComments(id)
        .then(comments => {
            console.log(comments)
            if (comments.length > 0) {
                res.status(200).json({ data: comments })
            } else {
                res.status(404).json({ err: "no comments found" })
            }
        })
        .catch(err => {
            res.status(500).json({ err: "served messed up" })
        })
})

router.post("/", (req, res) => {
    const post = req.body
    if(!post.title || !post.contents) {
        res.status(400).json({ err: "Please include title and contents"})
    } else {
        Posts.insert(post)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({ err: 'we fucked up'})
            })
    }
})

router.post("/:id/comments", (req, res) => {
    const comment = req.body
    Posts.insertComment(comment)
        .then(comment => {
            if(!comment) {
                res.status(404).json({ err: "please include a comment" })
            } else {
                res.status(200).json(comment)
            }
        })
        .catch(err => {
            res.status(500).json({ err: "server error" })
        })
})

router.put("/:id", (req, res) => {
    if(!req.body.title || !req.body.contents) {
        res.status(400).json({ err: 'please include title and contents'})
    } else {
    Posts.update(req.params.id, req.body)
        .then(count => {
            if(count > 0) {
                Posts.findById(req.params.id)
            }
        })
        .catch(err => {
            res.status(500).json({ err: 'we fucked up'})
        })
    }
})

router.delete("/:id", (req, res) => {
    Posts.remove(req.params.id)
    .then(removed => {
        if(removed){
            res.status(200).json({ message: "post successfully removed"})
        } else {
            res.status(404).json({ message: "post not found" })
        }
    })
    .catch(err => {
        res.status(500).json({ err: 'we fucked up'})
    })
})

module.exports = router