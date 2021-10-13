import {Invoice} from '../models/Invoice.js';
import { Category } from '../models/Category.js';
import { Wallet } from '../models/Wallet.js';
import pkg from 'sequelize';
import { sequelize } from '../instances/mysql.js';
const { QueryTypes } = pkg;


export const income = async(req,res)=>{
  const data = new Date;
  const userSession = req.session.user;
  let dateInput = req.query.date;
  let dateArr='';
  if(dateInput){
    dateArr = dateInput.split('-')
  }
  // gerar datalist 
  let months = []
  for(let range = -2;range <=2;range++){

    months.push({month:(range+(data.getMonth()+1))+"/"+data.getFullYear()})
  }
  

  let due_month = (dateArr[0] ? parseInt(dateArr[0]) : (data.getMonth()+1));
  let due_year = (dateArr[1] ? parseInt(dateArr[1]) : data.getFullYear());

  
  const income = await sequelize.query('SELECT * FROM app_invoice WHERE user_id= :userId AND type = "income" AND year(due_at) = :year AND month(due_at) = :month ORDER BY day(due_at)',{ replacements:{year:due_year,userId:userSession,month:due_month},
  type:QueryTypes.SELECT 
  });

    let dataIncome = []
    income.forEach((item)=>{
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
        dataIncome.push({id:item.id,date:dateFormat,description:item.description,status:statusPay,value:price})
    
    })
    let confirmedMonth='';
    if(!req.query.date){
        confirmedMonth = due_month+"/"+due_year;
    }else{
      confirmedMonth = req.query.date.replace('-','/');
    }
    

   
    res.render('pages/widgets/income/receber',{
      dataIncome,
      months,
      confirmedMonth
    })

}
export const incomeCreate = async(req,res)=>{

    const userSession = req.session.user
    const wallet = await Wallet.findAll({
        where:{
        user_id:userSession
        }
    })
    const category = await Category.findAll({
        where:{
        user_id:userSession,
        type:"income"
        
        }
    })

    res.render('pages/widgets/income/receber-create',{
        wallet,
        category
    })

}
export const incomeEdit = async(req,res)=>{
    const userSession = req.session.user
    const invoice =  await Invoice.findByPk(req.query.id)
    const wallet = await Wallet.findAll({
        where:{
        user_id:userSession
        }
    })
    const category = await Category.findAll({
        where:{
            user_id:userSession,
            type:"income"
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
    res.render('pages/widgets/income/receber-edit',{
        invoice,
        priceBr,
        setWallet,
        setCategory,
        status:{selUnpaid,selPaid},
})

}

export const filterLink = (req,res)=>{

  let dateLink = req.body.date.replace('/','-');

  res.json({redirect:"/receitas?date="+dateLink});
  

}

export const save = async(req,res)=>{

    const userSession = req.session.user;
      
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
    
        const incomeCreate =  Invoice.build({
          user_id: userSession,
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

        await incomeCreate.save()
        .catch((err)=>{
            console.log('linha:',err)
            res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'});
            return
        })
            
        res.json({redirect:"/receita-edit?id="+incomeCreate.id})
        return
    
      
    }
    if(req.body.action && req.body.action === 'update'){

        if(req.body.acao === 'flash_list'){

            const incomeUpdate = await Invoice.update({
                pay:req.body.pay,
            },{
                where:{
                id:req.body.id
                }
            })
            if(!incomeUpdate){
                res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
                return
            }

            res.json({message:"Registro Atualizado",type:'success'})

        }else{

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

            const incomeUpdate = await Invoice.update({
                wallet_id:req.body.wallet,
                category_id:req.body.category,
                description:req.body.description,
                price:parseFloat(req.body.price.replace(',','.')),
                due_at:req.body.date,
                type:"income",
                pay:req.body.pay,
                repeat_when:req.body.repeat_when,
                period: (!req.body.period ? "month" : req.body.period)
            },{
                where:{
                id:req.body.id
                }
            }) 

            if(!incomeUpdate){
                res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
                return
            }

            res.json({message:"Registro Atualizado",type:'success'})


        }
    }

    if(req.body.action && req.body.action === 'delete'){

        
        const incomeDelete = await Invoice.destroy({
            where: {
              id: req.body.id
            }
          });

       

        if(!incomeDelete){
            res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
            return
        }
        res.json({redirect:"/receitas"})
        return
          
    }


}