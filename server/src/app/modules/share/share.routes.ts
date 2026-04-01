import { Router } from 'express';
import checkAuth from '../../middlewares/check';
import { shareController } from './share.controller';
import validate from '../../middlewares/validate';
import { sharePostSchema, getSharesSchema } from './share.validation';

const router = Router();
router.use(checkAuth());

router.post('/:postId', validate(sharePostSchema), shareController.sharePost);
router.get('/:postId', validate(getSharesSchema), shareController.getShareUsers);

export default router;
