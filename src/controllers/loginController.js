import { User } from '../models/User.js';
import bcryptjs from 'bcryptjs';


export const viewLogin = (req,res)=>{
    res.render('pages/widgets/login/login')

}

export const loginAuth = async(req,res)=>{

  const user = await User.findOne({where:{email:req.body.email}});
  
  if(!user){
    res.json({message:"Usuário não está registrado",type:'error'})
    return
  }
  let passwdCheck = await bcryptjs.compare(req.body.passwd,user.password);
  if(!passwdCheck){
    res.json({message:"Usuário e senha não confere",type:'error'})
    return
  }
  req.session.user=user.id;
  req.session.fullName = user.full_name
  res.json({redirect:"/painel"})
 
}

export const logout = (req,res)=>{
  req.session.destroy();
  res.redirect('/login');
}