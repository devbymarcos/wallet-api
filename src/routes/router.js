import { Router } from 'express';
import * as HomeController from '../controllers/homeController.js';
import * as CategoryController from '../controllers/categoryController.js';
import * as WalletController from '../controllers/walletController.js';
import * as IncomeController from '../controllers/incomeController.js';
import * as ExpenseController from '../controllers/expenseController.js';
import * as InvoiceFixedController from '../controllers/invoiceFixedController.js';
import * as UserController from '../controllers/userController.js'
import * as LoginController from '../controllers/loginController.js';
import * as Auth from '../middlewares/Auth.js';
import * as Iscategory from '../middlewares/IsCategory.js';
import * as IsWallet from '../middlewares/IsWallet.js';
import * as InvoiceFixed from '../middlewares/InvoiceFixed.js';

const router = Router();

router.get('/',UserController.viewRegister);

router.get('/login',LoginController.viewLogin);
router.post('/login-validation',LoginController.loginAuth);
router.get('/logoff',LoginController.logout);
router.post('/forget-action',LoginController.forgetAction);
router.get('/altera-senha',LoginController.viewRecoveryPass)
//user
router.get('/perfil',Auth.privateRouter,UserController.viewPerfil);


//home
router.get('/painel',Auth.privateRouter,InvoiceFixed.createFixed,HomeController.home);
router.post('/chartdata',Auth.privateRouter,HomeController.dataChart);
router.post('/panels',Auth.privateRouter,HomeController.panelsData)

//category
router.get('/categorias',Auth.privateRouter,CategoryController.category);
router.get('/categoria-create',Auth.privateRouter,CategoryController.categoryCreate);
router.get('/categoria-editar',Auth.privateRouter,CategoryController.categoryEdit);
router.post('/category/save',Auth.privateRouter,CategoryController.save)
//wallet
router.get('/carteiras',Auth.privateRouter,WalletController.wallet);
router.get('/carteira-create',Auth.privateRouter,WalletController.walletCreate);
router.get('/carteira-editar',Auth.privateRouter,WalletController.walletEdit);
router.post('/wallet/save',Auth.privateRouter,WalletController.save);
// income
router.get('/receitas',Auth.privateRouter,IncomeController.income);
router.get('/receita-create',Auth.privateRouter,IsWallet.isWallet,Iscategory.isCategory,IncomeController.incomeCreate);
router.get('/receita-edit',Auth.privateRouter,IncomeController.incomeEdit);
router.post('/income-filter',Auth.privateRouter,IncomeController.filterLink)
router.post('/income/save',Auth.privateRouter,IncomeController.save);
//expense
router.get('/despesas',Auth.privateRouter,ExpenseController.expense);
router.get('/despesa-create',Auth.privateRouter,IsWallet.isWallet,Iscategory.isCategory,ExpenseController.expenseCreate);
router.get('/despesa-edit',Auth.privateRouter,ExpenseController.expenseEdit);
router.post('/expense-filter',Auth.privateRouter,ExpenseController.filterLink)
router.post('/expense/save',Auth.privateRouter,ExpenseController.save);

//fixed
router.get('/fixo',Auth.privateRouter,InvoiceFixedController.invoiceFixedList);
router.get('/fixed-edit',Auth.privateRouter,InvoiceFixedController.invoiceFixedEdit);
router.post('/fixed/update',Auth.privateRouter,InvoiceFixedController.fixedUpdate);



export default router;