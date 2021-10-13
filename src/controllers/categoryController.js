import { Category } from '../models/Category.js';

export const category = async(req,res)=>{

    let categories =  await Category.findAll({
      where:{
        user_id:req.session.user
      }
    })

    let typeInvoice =()=>{
        let arr = [];
        categories.forEach((item)=>{
          if(item.type === 'expense'){
            arr.push(
              {id:item.id,user_id:item.user_id,name:item.name,description:item.description,type:'Despesas'}
              )
          }else{
            arr.push(
              {id:item.id,user_id:item.user_id,name:item.name,description:item.description,type:'Receita'}
            )
          }
            
        })
        
        return arr;
    } 
   let activeMessage = '';
   if(req.query.category && req.query.category === 'not'){  
        activeMessage = true
   }
  res.render('pages/widgets/category/category',{
    typeInvoice,
    activeMessage
  });
}
export const categoryCreate = (req,res)=>{
  res.render('pages/widgets/category/category-create',{
    data:true,
    categories:true
  });
}
export const categoryEdit = async (req,res)=>{

  const category =  await Category.findByPk(req.query.id);
  const select = (type,value)=>{
    return(type == value ? 'selected' : '');
  }
  
const selIcome = select(category.type,'income');
const selExpense = select(category.type,'expense');


  res.render('pages/widgets/category/category-edit',{
    category,
    selects:{selIcome,selExpense}
    
  });
}
export const save = async (req,res)=>{

  if(req.body.action && req.body.action === 'create'){
   
    const categoryCreate = Category.build({
      user_id:req.session.user,
      name:req.body.name,
      description:req.body.description,
      type:req.body.type
    })

    if(!await categoryCreate.save()){
      res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
      return
    }

    res.json({redirect:"/categoria-editar?id="+ categoryCreate.id})
    return

  }

  if(req.body.action && req.body.action === 'update'){
   
    const categoryUpdate = Category.update({
      name:req.body.name,
      description:req.body.description,
      type:req.body.type
    },
    {
      where:{
        id:req.body.category_id
      }
    }
    )
    if(!categoryUpdate){
      res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
        return
    }
    res.json({message:"Registro atualizado",type:'success'})
      return
    
  }

  if(req.body.action && req.body.action === 'delete'){
   
    const categoryDelete = Category.destroy({
      where:{
        id:req.body.id
      }
    })
    if(!categoryDelete){
      res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
    return
    }
    res.json({redirect:"/categorias"})
    return
    
  }



}

