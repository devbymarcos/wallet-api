import { Router } from "express";

import * as CategoryController from "../controllers/category/categoryController";
import * as WalletController from "../controllers/wallet/walletController";
import * as LoginController from "../controllers/login/loginController";
import * as InvoiceController from "../controllers/invoice/InvoiceController";
import * as Auth from "../middlewares/Auth.js";
import * as UserController from "../controllers/user/userController";
import * as InvoiceFixedController from "../controllers/invoice/invoiceFixedController";
import * as ExtractController from "../controllers/extract/extractController";
import * as ReportController from "../controllers/report/reportController";

const router = Router();
router.get("/", (req, res) => res.status(200).json({ message: "activate" }));
router.post("/login", LoginController.loginAuth);
//USER
router.get("/user", Auth.privateRouter, UserController.getUser);
router.post("/user", UserController.registerUser);
router.put("/user", Auth.privateRouter, UserController.updateUser);
router.put("/userpass", Auth.privateRouter, UserController.updatePassword);
// DASH
router.get("/dash", Auth.privateRouter, InvoiceController.dashBoard);
//WALLET
router.get("/wallet", Auth.privateRouter, WalletController.wallets);
router.get("/wallet/:id", Auth.privateRouter, WalletController.walletUniq);
router.get(
    "/wallet-balance",
    Auth.privateRouter,
    WalletController.walletBalance
);
router.post("/wallet", Auth.privateRouter, WalletController.walletCreate);
router.put("/wallet", Auth.privateRouter, WalletController.walletUpdate);
router.delete("/wallet/:id", Auth.privateRouter, WalletController.walletDelete);
// CATEGORY
router.get("/categories", Auth.privateRouter, CategoryController.categories);
router.get("/category/:id", Auth.privateRouter, CategoryController.category);
router.post("/category", Auth.privateRouter, CategoryController.create);
router.delete("/category/:id", Auth.privateRouter, CategoryController.remove);
router.put("/category", Auth.privateRouter, CategoryController.update);
//INVOICE
router.get("/invoice", Auth.privateRouter, InvoiceController.invoice);
router.get("/invoice/:id", Auth.privateRouter, InvoiceController.invoiceSingle);
router.post("/invoice", Auth.privateRouter, InvoiceController.create);
router.put("/invoice", Auth.privateRouter, InvoiceController.update);
router.delete("/invoice/:id", Auth.privateRouter, InvoiceController.remove);
router.post("/transfer", Auth.privateRouter, InvoiceController.transfers);
//REPORTS
router.get(
    "/category-flow",
    Auth.privateRouter,
    ReportController.cashFlowOnCategory
);
//FIXED
router.get("/fixed", Auth.privateRouter, InvoiceFixedController.listAll);
router.post("/fixed", Auth.privateRouter, InvoiceFixedController.create);
router.get(
    "/fixed-generate",
    Auth.privateRouter,
    InvoiceFixedController.fixedGeneratePoint
);

//TODO CRIAR PARAMETROS PARA ESSA ROTA
router.get("/extract", Auth.privateRouter, ExtractController.extract);
export default router;
