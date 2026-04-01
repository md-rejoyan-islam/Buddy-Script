import { Router } from "express";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import authRoutes from "../modules/auth/auth.routes";
import commentRoutes from "../modules/comment/comment.routes";
import likeRoutes from "../modules/like/like.routes";
import postRoutes from "../modules/post/post.routes";
import replyRoutes from "../modules/reply/reply.routes";
import shareRoutes from "../modules/share/share.routes";

const router = Router();

// Swagger UI — only load if file exists
const swaggerPath = path.join(process.cwd(), "docs/swagger.yaml");
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = YAML.load(swaggerPath);
  router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/replies", replyRoutes);
router.use("/likes", likeRoutes);
router.use("/shares", shareRoutes);

export default router;
