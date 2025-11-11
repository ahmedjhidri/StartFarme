import { Router } from 'express';
import {
  getPosts,
  getPost,
  createPost,
  upvotePost,
  createReply,
  upvoteReply,
} from '../controllers/forumController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/', authenticate, createPost);
router.post('/:id/upvote', authenticate, upvotePost);
router.post('/:id/replies', authenticate, createReply);
router.post('/:id/replies/:replyId/upvote', authenticate, upvoteReply);

export default router;

