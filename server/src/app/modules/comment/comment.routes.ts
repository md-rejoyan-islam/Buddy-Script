import { Router } from 'express';
import checkAuth from '../../middlewares/check';
import { commentController } from './comment.controller';
import validate from '../../middlewares/validate';
import { createCommentSchema, updateCommentSchema, commentIdParamSchema, commentsByPostSchema } from './comment.validation';

const router = Router();
router.use(checkAuth());

router.get('/post/:postId', validate(commentsByPostSchema), commentController.getByPostId);
router.post('/post/:postId', validate(createCommentSchema), commentController.create);
router.patch('/:id', validate(updateCommentSchema), commentController.update);
router.delete('/:id', validate(commentIdParamSchema), commentController.delete);

export default router;
