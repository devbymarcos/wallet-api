import { Router } from "express";
import * as CategoryController from "../controllers/categoryController.js";
import * as WalletController from "../controllers/walletController.js";
import * as LoginController from "../controllers/loginController.js";
import * as InvoiceController from "../controllers/InvoiceController.js";
import * as ExpenseController from "../controllers/expenseController.js";
import * as IncomeController from "../controllers/incomeController.js";
import * as Auth from "../middlewares/Auth.js";
const router = Router();

router.post("/login", LoginController.loginAuth);
// DASH
router.get("/open-invoice", Auth.privateRouter, InvoiceController.openInvoice);
router.post("/chartdata", Auth.privateRouter, InvoiceController.dataChart);
router.post("/panels", Auth.privateRouter, InvoiceController.panelsData);
// CATEGORY
router.get("/category", Auth.privateRouter, CategoryController.category);
//WALLET
// router.get("/wallet", Auth.privateRouter, WalletController.wallet);

// //EXPENSE
// router.get("/expense", Auth.privateRouter, ExpenseController.expense);
// //INCOME
// router.get("/income", Auth.privateRouter, IncomeController.income);

export default router;
