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
router.post("/login-with-google", authController.loginWithGoogle);

export default router;
