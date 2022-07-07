import { Router } from "express";
import * as CategoryController from "../controllers/categoryController.js";
import * as WalletController from "../controllers/walletController.js";
import * as LoginController from "../controllers/loginController.js";
import * as InvoiceController from "../controllers/InvoiceController.js";
import * as ExpenseController from "../controllers/expenseController.js";
import * as IncomeController from "../controllers/incomeController.js";
import * as Auth from "../middlewares/Auth.js";
import * as UserController from "../controllers/userController.js";
import * as InvoiceFixedController from "../controllers/invoiceFixedController.js";
import * as BetweenWallet from "../controllers/betweenWalletController.js";

const router = Router();

router.post("/login", LoginController.loginAuth);
// DASH
router.get("/open-invoice", Auth.privateRouter, InvoiceController.openInvoice);
router.post("/chartdata", Auth.privateRouter, InvoiceController.dataChart);
router.post("/panels", Auth.privateRouter, InvoiceController.panelsData);
// CATEGORY
router.get("/category", Auth.privateRouter, CategoryController.category);
router.post("/category/save", Auth.privateRouter, CategoryController.save);
router.post(
    "/category/uniq",
    Auth.privateRouter,
    CategoryController.categoryUniq
);
//WALLET
router.get("/wallet", Auth.privateRouter, WalletController.wallet);
router.post("/wallet/save", Auth.privateRouter, WalletController.save);
router.post("/wallet/uniq", Auth.privateRouter, WalletController.walletUniq);

//EXPENSE
router.get("/expense", Auth.privateRouter, ExpenseController.expense);
//INCOME
router.get("/income", Auth.privateRouter, IncomeController.income);
//USER
router.get("/user", Auth.privateRouter, UserController.getUser);
// INVOICE
router.get(
    "/auto-create-fixed",
    Auth.privateRouter,
    InvoiceFixedController.autoFixedCreate
);
router.post("/transfer", Auth.privateRouter, BetweenWallet.save);
export default router;
