import { Router } from "express";
import * as CategoryController from "../controllers/categoryController.js";
import * as WalletController from "../controllers/walletController.js";
import * as LoginController from "../controllers/loginController.js";
import * as InvoiceController from "../controllers/InvoiceController.js";

const router = Router();

router.post("/login", LoginController.loginAuth);

// DASH
router.get("/open-invoice", InvoiceController.openInvoice);
router.post("/chartdata", InvoiceController.dataChart);
router.post("/panels", InvoiceController.panelsData);
// CATEGORY
router.get("/category", CategoryController.category);
//WALLET
router.get("/wallet", WalletController.wallet);

export default router;
