import { Router } from "express";
import * as CategoryController from "../controllers/categoryController.js";
import * as WalletController from "../controllers/walletController.js";
import * as LoginController from "../controllers/loginController.js";
import * as InvoiceController from "../controllers/InvoiceController.js";
import * as ExpenseController from "../controllers/expenseController.js";
import * as IncomeController from "../controllers/incomeController.js";

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

//EXPENSE
router.get("/expense", ExpenseController.expense);
//INCOME
router.get("/income", IncomeController.income);

export default router;
