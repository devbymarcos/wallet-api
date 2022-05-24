import { Router } from "express";
import * as CategoryController from "../controllers/categoryController.js";
import * as WalletController from "../controllers/walletController.js";
import * as LoginController from "../controllers/loginController.js";

const router = Router();

router.post("/login", LoginController.loginAuth);

router.get("/category", CategoryController.category);

router.get("/wallet", WalletController.wallet);

export default router;
