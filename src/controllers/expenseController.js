import {Invoice} from '../models/Invoice.js';
import { Category } from '../models/Category.js';
import { Wallet } from '../models/Wallet.js';
import pkg from 'sequelize';
import { sequelize } from '../instances/mysql.js';
const { QueryTypes } = pkg;


export const expense = async(req,res)=>{
  const userId = res.locals.user//req.session.user
  let data = new Date;

  let dateInput = req.query.date;
  let dateArr='';
  if(dateInput){
    dateArr = dateInput.split('-')
  }
    
  //gerar mes e ano para query
  let due_month = (dateArr[0] ? parseInt(dateArr[0]) : (data.getMonth()+1));
  let due_year = (dateArr[1] ? parseInt(dateArr[1]) : data.getFullYear());

  
  const expense = await sequelize.query('SELECT * FROM app_invoice WHERE user_id= :userId AND type = "expense" AND year(due_at) = :year AND month(due_at) = :month ORDER BY day(due_at)',{ replacements:{year:due_year,userId:userId,month:due_month},
  type:QueryTypes.SELECT 
  });

  // gerar datalist para placeholder input 
  let months = []
  for(let range = -2;range <=2;range++){
    months.push({month:(range+(data.getMonth()+1))+"/"+data.getFullYear()})
  }
    let dataExpense = []
    expense.forEach((item)=>{
        //formata data
        let date = new Date(item.due_at);
        let dateFormat = date.getDate() + "/" +(date.getMonth()+1) + "/" +date.getFullYear();
        let price = item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        //formata status
        let statusPay = '';
        if(item.pay === 'paid'){
          statusPay = true;
        } else{
          statusPay = false;
        }
        //cria novo objto com dados formatado
        dataExpense.push({id:item.id,date:dateFormat,description:item.description,status:statusPay,value:price})
    
    })
    let confirmedMonth='';
    if(!req.query.date){
       confirmedMonth = due_month+"/"+due_year;
    }else{
      confirmedMonth = req.query.date.replace('-','/');
    }
    

   
    res.render('pages/widgets/expense/pagar',{
      dataExpense,
      months,
      confirmedMonth
    })

}
export const expenseCreate = async(req,res)=>{

    const userSession = res.locals.user//req.session.user
    const wallet = await Wallet.findAll({
        where:{
        user_id:userSession
        }
    })
    const category = await Category.findAll({
        where:{
        user_id:userSession,
        type:"expense"
        }
    })
  
    res.render('pages/widgets/expense/pagar-create',{
        wallet,
        category
    })

}
export const expenseEdit = async(req,res)=>{
  const userSession = res.locals.user;//req.session.user
  const invoice =  await Invoice.findByPk(req.query.id)
  const wallet = await Wallet.findAll({
    where:{
      user_id:userSession
    }
  })
  const category = await Category.findAll({
    where:{
      user_id:userSession,
      type:"expense"
    }
  })


  const select = (type,value)=>{
    return(type == value ? 'selected' : '');
  }
  const setWallet = [];
  wallet.forEach((wal)=>{
    setWallet .push({id:wal.id,name:wal.name,selAttr:select(wal.id,invoice.wallet_id)});

  })
  const setCategory = [];
  category.forEach((cate)=>{
    setCategory .push({id:cate.id,name:cate.name,selAttr:select(cate.id,invoice.category_id)});

  })
  
  const selUnpaid = select(invoice.pay,'unpaid');
  const selPaid = select(invoice.pay,'paid');

  const priceBr = invoice.price.toFixed('2').replace('.',',');

  res.render('pages/widgets/expense/pagar-edit',{
      invoice,
      priceBr,
      setWallet,
      setCategory,
      status:{selUnpaid,selPaid},
  })

}

// gera link para busca 
export const filterLink = (req,res)=>{

  let dateLink = req.body.date.replace('/','-');

  res.json({redirect:"/despesas?date="+dateLink});
  

}

export const save = async(req,res)=>{

    const useId = res.locals.user;//req.session.user
    if(req.body.action && req.body.action === 'create'){

        if(!req.body.description){
            res.json({message:"Preencha a descrição",type:'warning'})
            return
        }else if(!req.body.price){
            res.json({message:"Preencha o valor",type:'warning'})
            return
        }else if(!req.body.category){
            res.json({message:"Escolha a categoria",type:'warning'})
        }else if(!req.body.wallet){
            res.json({message:"Escolha a carteira",type:'warning'})
        }else if(!req.body.date){
            res.json({message:"É necessario a data",type:'warning'})
        }
    
        if(req.body.repeat_when === 'enrollment'){

            const date = req.body.date;
            const dateArr1 = date.split('-');
            const [year,month,day] = dateArr1.map(Number);
            
            const data = new Date(year,month-1,day);
            let dataDb = '';
            let dia= '';
            let mes= '';
            let ano= '';
            let p = 0;
            let invoiceSave='';
            for(let i = 0;i < req.body.enrollments;i++){
                p++;
                if(i === 0){
                    data.setMonth(data.getMonth());
                }else{
                    data.setMonth(data.getMonth()+1);
                }
                  
                dia = data.getDate();
                mes = data.getMonth()+1;
                ano = data.getFullYear();
                dataDb =  ano +'-'+ mes +'-'+ dia;

                const  expenseCreate = await  Invoice.create({
                    user_id: useId,
                    wallet_id:req.body.wallet,
                    category_id:req.body.category,
                    description:req.body.description + " parcela "+p+"/"+req.body.enrollments,
                    price:parseFloat(req.body.price.replace(',','.')),
                    due_at:dataDb,
                    type:req.body.type,
                    repeat_when:req.body.repeat_when,
                });

            }
            
                      
            res.json({redirect:"/despesas"})
            return



        }
        //end parcelado 


        const expenseCreate =  Invoice.build({
            user_id: useId,
            wallet_id:req.body.wallet,
            category_id:req.body.category,
            description:req.body.description,
            price:parseFloat(req.body.price.replace(',','.')),
            due_at:req.body.date,
            type:(req.body.repeat_when === 'fixed' ? "fixed_"+req.body.type : req.body.type),
            pay:(req.body.repeat_when ==='fixed' ? "paid" : "unpaid"),
            repeat_when:req.body.repeat_when,
            period: (!req.body.period ? "month" : req.body.period)
        })

        if(!await expenseCreate.save()){
        res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
        return
        }
        if(req.body.repeat_when === 'fixed'){
            res.json({redirect:"/fixo"})
            return 
        }
        res.json({redirect:"/despesa-edit?id="+expenseCreate.id})
        return

  
    }
  
    if(req.body.action && req.body.action === 'update'){

      // atualiza apenas o status de pagamento
      if(req.body.acao === 'flash_list'){
          const expenseUpdateFlash = await Invoice.update({
            pay:req.body.pay,
          },{
            where:{
              id:req.body.id
            }
          })
          if(!expenseUpdateFlash){
            res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
            return
          }

          res.json({message:"Registro Atualizado",type:'success'})

        }else{

            const expenseUpdate = await Invoice.update({
            user_id: useId,
            wallet_id:req.body.wallet,
            category_id:req.body.category,
            description:req.body.description,
            price:parseFloat(req.body.price.replace(',','.')),
            due_at:req.body.date,
            type:"expense",
            pay:req.body.pay,
            repeat_when:req.body.repeat_when,
            period: (!req.body.period ? "month" : req.body.period)
            },{
                where:{
                id:req.body.id
                }
            }) 

            if(!expenseUpdate){
                res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
                return
            }

            res.json({message:"Registro Atualizado",type:'success'})
        }
    }
    if(req.body.action && req.body.action === 'delete'){

        const expenseDelete = await Invoice.destroy({
            where: {
              id: req.body.id
            }
          });

       

        if(!expenseDelete){
            res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
            return
        }
        res.json({redirect:"/despesas"})
        return
          
    }


}