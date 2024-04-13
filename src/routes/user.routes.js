import { Router } from "express";
import { registerUser, getAlluser, loginUser, logoutUser, updatethought, mythoughts } from "../controllers/user.controller.js";
import { verifyJwt } from "../controllers/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/users").get(verifyJwt, getAlluser);
router.route("/mythought").get(verifyJwt, mythoughts);
router.route("/updatethought").post(verifyJwt, updatethought)
router.route("/logout").post(verifyJwt, logoutUser)

export default router