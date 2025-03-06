import Post from '../models/post.model.js';

class PostController {
  static async getAll(req, res) {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  static async addPost(req, res) {
    try {
      const { title, description } = req.body;
      const post = await Post.create({ title, description });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create post' });
    }
  }

  static async deletePost(req, res) {
    try {
      const postId = req.params.id;
      await Post.findByIdAndDelete(postId);
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  }
}

export default PostController;
