const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/Post');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}


function handleError(error, res) {
  if(error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  console.error(error);
  return res.status(500).json({ error: 'Server error' });
}

router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const post = new Post({ title, content, author });
    const savedPost = await post.save();
    return res.status(201).json(savedPost);
  } catch(error) {
    return handleError(error, res);
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch(error) {
    return handleError(error, res);
  }
});

router.get('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }
  
  try {
    const post = await Post.findById(req.params,satisfies.id);
    if(!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(200).json(post);
  } catch(error) {
    return handleError(error, res);
  }
});

router.put('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  try {
    const { title, content, autho } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, autho },
      { new: true, runValidators: true}
    );
    if(!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(200).json(updatedPost);
  } catch(error) {
    return handleError(error, res);
  }
});

router.delete('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  try {
    const deletedPost = await Post.findByIdandDelete(req.params.id);
    if(!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch(error) {
    return handleError(error, res);
  }
});

module.exports = router;