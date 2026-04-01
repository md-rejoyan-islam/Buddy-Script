import { Router } from 'express';
import checkAuth from '../../middlewares/check';
import { likeController } from './like.controller';
import validate from '../../middlewares/validate';
import { likePostSchema, likeCommentSchema, likeReplySchema, getLikesSchema } from './like.validation';

const router = Router();
router.use(checkAuth());

router.post('/post/:postId', validate(likePostSchema), likeController.togglePostLike);
router.post('/comment/:commentId', validate(likeCommentSchema), likeController.toggleCommentLike);
router.post('/reply/:replyId', validate(likeReplySchema), likeController.toggleReplyLike);
router.get('/:type/:id', validate(getLikesSchema), likeController.getLikeUsers);

export default router;
