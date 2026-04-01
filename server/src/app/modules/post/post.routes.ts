import { Router } from "express";
import checkAuth from "../../middlewares/check";
import validate from "../../middlewares/validate";
import { upload } from "../../utils";
import { postController } from "./post.controller";
import {
  createPostSchema,
  updatePostSchema,
  postIdParamSchema,
} from "./post.validation";

const router = Router();

router.use(checkAuth());

router.get("/", postController.getFeed);
router.get("/:id", validate(postIdParamSchema), postController.getById);
router.post(
  "/",
  upload.single("image"),
  validate(createPostSchema),
  postController.create,
);
router.patch(
  "/:id",
  upload.single("image"),
  validate(updatePostSchema),
  postController.update,
);
router.delete("/:id", validate(postIdParamSchema), postController.delete);

export default router;
