import { sequelize } from '../instances/mysql.js';
import pkg from 'sequelize';
import { Category }  from '../models/Category.js'; 
const { QueryTypes } = pkg;

export const cashFlow = async(req,res)=>{

  const  userSession = req.session.user
  
  const data = new Date;

  let dateInput = req.body.date;
  let dateArr='';
  if(dateInput){
    dateArr = dateInput.split('-')
  }
    
  //gerar mes e ano para query
  let due_month = (dateArr[0] ? parseInt(dateArr[0]) : (data.getMonth()+1));
  let due_year = (dateArr[1] ? parseInt(dateArr[1]) : data.getFullYear());
  
  let invoice =  await sequelize.query('SELECT app_categories.id as codigo,app_categories.name as nome,sum(app_invoice.price)  as preco,month(app_invoice.due_at) as mes,(select sum(price) from app_invoice where app_invoice.pay="paid" AND month(app_invoice.due_at) = :m AND app_invoice.user_id = :userId AND year(app_invoice.due_at) = :ano AND app_invoice.type = "income") as income,(select sum(price) from app_invoice where app_invoice.pay="paid" AND month(app_invoice.due_at) = :m AND app_invoice.user_id = :userId AND year(app_invoice.due_at) = :ano AND app_invoice.type = "expense") as expense FROM app_invoice  INNER JOIN  app_categories  ON( app_invoice.category_id = app_categories.id) WHERE app_invoice.pay="paid" AND app_invoice.user_id = :userId AND year(app_invoice.due_at) = :ano AND month(app_invoice.due_at) = :m AND app_invoice.type IN("income","expense") group by mes,codigo order by mes ASC',
  { replacements:{ano:due_year,userId:userSession,m:due_month},
    type:QueryTypes.SELECT 
  });

if(invoice.length < 1 ){
    res.status(204).end();
    return
}

 const totalIncome = invoice[0].income;
 const totalExpense = invoice[0].expense;
 const balance = (totalIncome - totalExpense);

let values = {
    tIncome:totalIncome,
    tExpense:totalExpense,
    tBalance:balance

};



  const months = ["Janeiro","Fevereiro","Março",
        "Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro",
        "Dezembro"
      ];
   

  let month = []
  month.push({nome:months[invoice[0].mes-1]});
     
  let json=[]
  json.push(month,invoice,values);

  console.log(invoice)
  res.json(json); 
 
}


export const viewCashFlow = async (req,res)=>{
    const userSession = req.session.user
    const userName  = req.session.fullName;

  const income = await Category.findAll({
    where:{
      user_id:userSession,
      type:'income'
      
    }
  })

  let expense = await Category.findAll({
    where:{
      user_id:userSession,
      type:'expense'
    },
    order:[
      ['name','ASC']
    ]
  })
  
  res.render('pages/widgets/cashflow/cashflow',{
    income,
    expense,
    userName
    
  });
}