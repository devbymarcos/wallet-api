import {Invoice} from '../models/Invoice.js';
import pkg from 'sequelize';
import { sequelize } from '../instances/mysql.js';
const { QueryTypes } = pkg;


export const home = async(req,res)=>{
  const userName  = req.session.fullName;
  const userSession = req.session.user
  
   //INCOME && EXPENSE 

    const income = await sequelize.query("SELECT *  FROM app_invoice WHERE user_id= :userId AND pay = :p AND type = 'income' AND due_at < DATE(NOW())",{
        replacements:{userId:userSession,p:'unpaid'},
        type:QueryTypes.SELECT   
    })
   const expense = await sequelize.query("SELECT *  FROM app_invoice WHERE user_id= :userId AND pay = :p AND type = 'expense' AND due_at < DATE(NOW())",{
    replacements:{userId:userSession,p:'unpaid'},
    type:QueryTypes.SELECT   
})
    let openIncome = income.map((item)=>{
        let obj = {};

        let dateArr = item.due_at.split('-');
        let [year,month,day] = dateArr.map(Number);

        let date = new Date(year,month-1,day);
        let dateFormat = date.getDate() + "/" +(date.getMonth()+1) + "/" +date.getFullYear();
        //formata status
        let statusPay = '';
        if(item.pay === 'paid'){
          statusPay = true;
        } else{
          statusPay = false;
        }
        obj.id = item.id;
        obj.description = item.description;
        obj.price =item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        obj.pay = statusPay;
        obj.due_at = dateFormat;

        return obj;

    })

    let openExpense = expense.map((item)=>{
        let obj = {};

        let dateArr = item.due_at.split('-');
        let [year,month,day] = dateArr.map(Number);

        let date = new Date(year,month-1,day);
        let dateFormat = date.getDate() + "/" +(date.getMonth()+1) + "/" +date.getFullYear();
        //formata status
        let statusPay = '';
        if(item.pay === 'paid'){
          statusPay = true;
        } else{
          statusPay = false;
        }
        obj.id = item.id;
        obj.description = item.description;
        obj.price =item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        obj.pay = statusPay;
        obj.due_at = dateFormat;

        return obj;
    })


    res.render('pages/widgets/dash/home',{
        openExpense,
        openIncome,
        userName
    });
}



export const dataChart = async (req,res)=>{
    const userSession =  req.session.user
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
    if(chart.length < 1){
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


export const panelsData = async (req,res)=>{
    const userSession = req.session.user
    const wallet = await sequelize.query("SELECT (SELECT SUM(price) FROM app_invoice WHERE user_id= :userId AND pay = 'paid' AND type = 'income') as income,(select SUM(price) FROM app_invoice WHERE user_id= :userId AND pay = 'paid' AND type = 'expense') as expense from app_invoice WHERE user_id = :userId and pay = 'paid' group by income,expense",
     {replacements:{userId:userSession},
        type:QueryTypes.SELECT 
    })
    
    let data ='';
    if(wallet.length < 1){
        data = false;
        res.json(data);
        return;
    }
    
    data = {
        balance:wallet[0].income - wallet[0].expense
    }

    res.json(data);

    
}