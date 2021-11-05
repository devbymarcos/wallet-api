import { Wallet} from '../models/Wallet.js';

export const wallet = async(req,res)=>{
    const userSession = 1 // req.session.user
    const userName  = req.session.fullName;
  let wallet =  await Wallet.findAll({
    where: {
      user_id: userId
    }
  });
  let activeMessage = '';
   if(req.query.wallet && req.query.wallet === 'not'){  
        activeMessage = true
   }
  res.render('pages/widgets/wallet/wallet',{
    wallet,
    activeMessage,
    userName
  });
}

export const walletCreate = (req,res)=>{
  const userName  = req.session.fullName;
  res.render('pages/widgets/wallet/wallet-create',{
    userName
  });

}
export const walletEdit = async(req,res)=>{
    const userName  = req.session.fullName;
    let wallet =  await Wallet.findByPk(req.query.id);
    res.render('pages/widgets/wallet/wallet-edit',{
        wallet,
        userName
    });
}

export const save = async(req,res)=>{
  
  if(req.body.action && req.body.action ==='create'){
    
    const wCreate = Wallet.build({
      user_id:req.session.user,
      name:req.body.name,
      description:req.body.description
    })
    ;
    if(!await wCreate.save()){
      res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
      return
    };
    res.json({redirect:"/carteira-editar?id="+ wCreate.id})
    return

  }
  if(req.body.action && req.body.action === 'update'){
      
      const wUpdate = await Wallet.update({
        name:req.body.name,
        description:req.body.description
        },{
          where:{
            id:req.body.wallet_id
          }
        }
      )
      if(!wUpdate){
        res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
        return
      }
      res.json({message:"Registro atualizado",type:'success'})
      return
  }
  if(req.body.action && req.body.action === 'delete'){

    const wDelete =  await Wallet.destroy({
      where:{
        id:req.body.id
      }
    });

    if(!wDelete){
      res.json({message:"Ooops, algo deu errado, contate o admin",type:'error'})
    return
    }
    res.json({redirect:"/carteiras"})
    return



  }

   
}