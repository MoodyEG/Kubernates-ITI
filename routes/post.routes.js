import { Router } from 'express';
import PostController from '../controllers/post.controller.js';

const router = Router();

router.get('/', PostController.getAll);
router.post('/add', PostController.addPost);
router.delete('/:id', PostController.deletePost);

export default router;
