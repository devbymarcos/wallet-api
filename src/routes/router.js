import { Router } from "express";
import * as CategoryController from "../controllers/categoryController.js";
import * as WalletController from "../controllers/walletController.js";
import * as LoginController from "../controllers/loginController.js";
import * as HomeController from "../controllers/HomeController.js";

const router = Router();

router.post("/login", LoginController.loginAuth);

// DASH
router.get("/dash", HomeController.home);
router.post("/chartdata", HomeController.dataChart);
router.post("/panels", HomeController.panelsData);
// CATEGORY
router.get("/category", CategoryController.category);
//WALLET
router.get("/wallet", WalletController.wallet);

export default router;
