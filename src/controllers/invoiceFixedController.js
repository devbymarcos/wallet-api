 import {Invoice}  from '../models/Invoice.js';
 import {Wallet} from '../models/Wallet.js';
 import { Category } from '../models/Category.js';
 
 export const  invoiceFixedList = async (req,res)=>{
  const userId = req.session.user;
  const userName  = req.session.fullName;
  const fixed = await Invoice.findAll({
    where:{
      user_id:userId,
      type:['fixed_income','fixed_expense']
      
    }
  })
  
  const newFixed = fixed.map((item)=>{
    const obj = {}
    const date = new Date(item.due_at);
    //formata status
    let statusPay = '';
    if(item.pay === 'paid'){
      statusPay = true;
    } else{
      statusPay = false;
    }
    obj.id = item.id;
    obj.due_at = (date.getDate()< 10 ? "Dia 0"+date.getDate():"Dia "+date.getDate() );
    obj.description = (item.type ==='fixed_income' ? 'Receita / '+item.description: 'Despesa / '+item.description);
    obj.price = item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})+" /mês";
    obj.status = statusPay;
    obj.type = item.type;
    return obj;
  })
    
    res.render('pages/widgets/invoice-fixed/fixed',{
      newFixed,
      userName
    });
    
}
 export const invoiceFixedEdit = async(req,res)=>{
    const userId = req.session.user
    const userName  = req.session.fullName;
    const invoice =  await Invoice.findByPk(req.query.id)
    const wallet = await Wallet.findAll({
      where:{
        user_id:userId
      }
    })
    const category = await Category.findAll({
      where:{
        user_id:userId
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
 
    console.log(selPaid)
    const classe = (invoice.type === "fixed_income" ? "text-color-green" : "text-color-red");
    const typeName = (invoice.type == "fixed_income" ? " RECEITA" : " DESPESA");
    const priceBr = invoice.price.toFixed('2').replace('.',',');
    

    res.render('pages/widgets/invoice-fixed/fixed-edit',{
      invoice,
      classe,
      typeName,
      priceBr,
      setWallet,
      setCategory,
      status:{selUnpaid,selPaid},
      userName
      
    });
    
}

export const fixedUpdate = (req,res)=>{

  let value = parseFloat(req.body.price.replace(',','.'));

  const fixedUpdate = Invoice.update({
    wallet_id:req.body.wallet,
    category_id:req.body.category,
    description:req.body.description,
    price:value,
    due_at:req.body.date,
    pay:req.body.pay
  },{
    where:{
      id:req.body.fixed_id
    }
  })

  if(!fixedUpdate){
    res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
      return
  }
  res.json({message:"Registro atualizado",type:'success'})
  return

}

export const fixedDelete = (req,res)=>{

    const fixedDelete  = Invoice.destroy({
        where:{
            id:req.body.id
        }
    })
    if(!fixedDelete){
        res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
    return
    }
    res.json({redirect:"/fixo"})
    return


}

