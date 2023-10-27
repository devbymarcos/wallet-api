import { Router } from "express";

import * as CategoryController from "../controllers/categoryController.js";
import * as WalletController from "../controllers/walletController.js";
import * as LoginController from "../controllers/loginController.js";
import * as InvoiceController from "../controllers/InvoiceController.js";
import * as Auth from "../middlewares/Auth.js";
import * as UserController from "../controllers/userController.js";
import * as InvoiceFixedController from "../controllers/invoiceFixedController.js";
import * as BetweenWallet from "../controllers/betweenWalletController.js";
import * as ExtractController from "../controllers/extractController.js";

const router = Router();
router.get("/", (req, res) => res.status(200).json({ message: "activate" }));
router.post("/login", LoginController.loginAuth);
// DASH
router.get("/dash", Auth.privateRouter, InvoiceController.dashBoard);
// CATEGORY
router.get("/category", Auth.privateRouter, CategoryController.category);
router.get(
    "/category/:id",
    Auth.privateRouter,
    CategoryController.categoryUniq
);
router.post("/category", Auth.privateRouter, CategoryController.save);
router.delete("/category", Auth.privateRouter, CategoryController.save); //TODO AJUSTAR PARA PASSAR NA ROTA
router.put("/category", Auth.privateRouter, CategoryController.save);
//WALLET
router.get("/wallets", Auth.privateRouter, WalletController.wallet);
router.get("/wallet/:id", Auth.privateRouter, WalletController.walletUniq);
router.post("/wallet", Auth.privateRouter, WalletController.walletCreate);
router.put("/wallet", Auth.privateRouter, WalletController.walletUpdate);
router.delete("/wallet", Auth.privateRouter, WalletController.walletDelete);

//INVOICE
router.get("/expense", Auth.privateRouter, InvoiceController.expense);
router.get("/income", Auth.privateRouter, InvoiceController.income);
router.get(
    "/auto-create-fixed",
    Auth.privateRouter,
    InvoiceFixedController.autoFixedCreate
);
router.get(
    "/fixed",
    Auth.privateRouter,
    InvoiceFixedController.invoiceFixedList
);
router.get(
    "/invoice/single/:id",
    Auth.privateRouter,
    InvoiceController.invoiceSingle
);
router.post("/invoice", Auth.privateRouter, InvoiceController.create);
router.put("/invoice", Auth.privateRouter, InvoiceController.update);
router.delete("/invoice/:id", Auth.privateRouter, InvoiceController.drop);
//USER
router.post("/user", UserController.registerUser);
router.get("/user", Auth.privateRouter, UserController.getUser);
router.put("/user", Auth.privateRouter, UserController.updateUser);

router.post("/transfer", Auth.privateRouter, BetweenWallet.save);
//TODO CRIAR PARAMETROS PARA ESSA ROTA
router.get("/extract", Auth.privateRouter, ExtractController.extract);
export default router;
