import initJquery from "./modules/jquery.js";
import initChart from "./modules/highchart.js";
import initPanels from "./modules/dash-panels.js";
import initChooseWallet from "./modules/choose-wallet.js";
import initMenuMobile from "./modules/menuMobile.js";
import initLogin from "./modules/login.js";
import initUserLogin from "./modules/userLogin.js";
import * as TypeRegister from "./modules/typeRegister.js";

initJquery();
initChart();
initPanels();
initChooseWallet();
initMenuMobile();
initLogin();
initUserLogin();
TypeRegister.colorRegister();
