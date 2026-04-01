import { Router } from 'express';
import checkAuth from '../../middlewares/check';
import { replyController } from './reply.controller';
import validate from '../../middlewares/validate';
import { createReplySchema, updateReplySchema, replyIdParamSchema, repliesByCommentSchema } from './reply.validation';

const router = Router();
router.use(checkAuth());

router.get('/comment/:commentId', validate(repliesByCommentSchema), replyController.getByCommentId);
router.post('/comment/:commentId', validate(createReplySchema), replyController.create);
router.patch('/:id', validate(updateReplySchema), replyController.update);
router.delete('/:id', validate(replyIdParamSchema), replyController.delete);

export default router;
