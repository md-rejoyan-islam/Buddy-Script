import { Router } from "express";
import checkAuth from "../../middlewares/check";
import validate from "../../middlewares/validate";
import { authController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", checkAuth(), authController.getMe);
router.post("/refresh", authController.refresh);
router.get("/google", authController.googleRedirect);
router.get("/google/callback", authController.googleCallback);

export default router;
