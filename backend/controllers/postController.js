const Post = require('../models/Post');

// POST /api/posts
const createPost = async (req, res) => {
  try {
    const { title, content, tags = [] } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await Post.create({
      title,
      content,
      tags,
      author: req.user.id
    });

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/posts
const getAllPosts = async (_req, res) => {
  try {
    const posts = await Post.find().populate('author', '-password');
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/posts/:id
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', '-password');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT /api/posts/:id
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, tags } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) post.tags = tags;

    const updated = await post.save();
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /api/posts/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    return res.json({ message: 'Post removed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};


