const express = require('express');
const db = require('../data/db');

const router = express.Router();
router.use(express.json());

router.post('/', (req, res) => {
    //create post
    if(req.body.title && req.body.contents) {
        try {
            const date = new Date().toString();
            const post = {
                title: req.body.title,
                contents: req.body.contents,
                created_at: date,
                updated_at: date
            }
            console.log(post);
            db.insert(post);
            res.status(201).json(post);
        } catch {
            res.status(500).json({ error: "There was an error while saving the post to the database" });
        }
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }
});

router.post('/:id/comments', (req, res) => {
    //creates comment
    const id = req.params.id;
    try {
        db.findById(id)
        .then(response => {
            if(response.length !== 0) {
                if(req.body.text) {
                    const date = new Date().toString();
                    const comment = {
                        text: req.body.text,
                        created_at: date,
                        updated_at: date,
                        post_id: id
                    }
                    db.insertComment(comment);
                    res.status(201).json(comment);
                } else {
                    res.status(400).json({ errorMessage: "Please provide text for the comment." })
                }
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
    } catch {
        res.status(500).json({ error: "The comments information could not be retrieved." });
    }
});

router.get('/', (req, res) => {
    //get all posts
    try {
        db.find().then(data => res.send(data));
    } catch {
        res.status(500).json({ error: "The posts information could not be retrieved." });
    }
})

router.get('/:id', (req, res) => {
    //find post by id
    const id = req.params.id;
    console.log(id);
    try {
        db.findById(id).then(data => {
            if(data.length !== 0) {
                res.send(data);
                console.log(data.length);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
    } catch {
        res.status(500).json({ error: "The comments information could not be retrieved." });
    }
})

router.get('/:id/comments', (req, res) => {
    //returns array of comments associated with the post id
    try {
        const id = req.params.id;
        db.findById(id)
        .then(response => {
            if(response.length !== 0) {
                db.findPostComments(id)
                .then(response => {
                    res.send(response);
                })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
    } catch {
        res.status(500).json({ error: "The comments information could not be retrieved." });
    }
})

router.delete('/:id', (req, res) => {
    //removes post
    const id = req.params.id;
    try {
        db.findById(id)
        .then(response => {
            if(response.length !== 0) {
                db.remove(id)
                .then(response => {
                    console.log(response);
                })
                res.status(204);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
    } catch {
        res.status(500).json({ error: "The post could not be removed" });
    }
})

router.put('/:id', (req, res) => {
    //updates post
    const id = req.params.id;
    try {
        db.findById(id)
        .then(response => {
            if(response.length !== 0) {
                if(req.body.title && req.body.contents) {
                    const date = new Date().toString();
                    const updatedPost = {
                        title: req.body.title,
                        contents: req.body.contents,
                    }
                    console.log(updatedPost);
                    db.update(id, updatedPost)
                    .then(response => res.status(200));
                } else {
                    res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
                }
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
    } catch {
        res.status(500).json({ error: "The post information could not be modified." });
    }
})

module.exports = router;