import {Invoice} from '../models/Invoice.js';
import pkg from 'sequelize';
import { sequelize } from '../instances/mysql.js';
const { QueryTypes } = pkg;


export const home = (req,res)=>{
  const userName  = req.session.fullName;
   //INCOME && EXPENSE 

  res.render('pages/widgets/dash/home',{
    expense:true,
    income:true,
    userName
  });
}



export const dataChart = async (req,res)=>{
    const userSession = res.locals.user // req.session.user
    let dateChart = new Date();

    let chartMonths = [];
    for(let i = 0;i < 4;i++){

        if(i === 0 ){ 
            dateChart.setMonth(dateChart.getMonth())
        }else{
            dateChart.setMonth(dateChart.getMonth()-1)
        }
        chartMonths.push((dateChart.getMonth()+1)+'/'+dateChart.getFullYear());

    }

    const chart = await sequelize.query("SELECT year(due_at) as due_year,month(due_at) as due_month,DATE_FORMAT (due_at,'%m/%y') AS due_date,(SELECT SUM(price) FROM app_invoice WHERE user_id = :userId AND pay = 'paid' AND type = 'income' AND year(due_at) = due_year AND month(due_at) = due_month) as income,(SELECT SUM(price) FROM app_invoice WHERE user_id = :userId AND pay = 'paid' AND type = 'expense' AND year(due_at) = due_year AND month(due_at) = due_month) as expense FROM app_invoice WHERE user_id = :userId AND pay = 'paid' AND due_at >= date(now()- INTERVAL 4 MONTH) GROUP BY due_year, due_month,due_date limit 5",{ replacements:{userId:userSession},
    type:QueryTypes.SELECT 
  })
    let chartCategories = [];
    let chartExpense = [];
    let chartIncome = [];

    chart.forEach((item)=>{
        chartCategories.push(item.due_month +'/'+ item.due_year );
        chartExpense.push(item.expense);
        chartIncome.push(item.income)
    })
    let dataBase = '';
    if(!chart){
        dataBase = {
            months:chartMonths.reverse(),
            income:[0,0,0,0],
            expense:[0,0,0,0]
        }
    }else{
        dataBase = {
            months:chartCategories,
            income:chartIncome,
            expense:chartExpense
        }
    }
    
    res.json(dataBase);
}