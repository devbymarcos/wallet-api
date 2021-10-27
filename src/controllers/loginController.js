import { User } from '../models/User.js';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;

dotenv.config();

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

  const token = sign(
      {id:user.id,email:user.email},
      String(process.env.SECRET_KEY_JWT)
  )

 req.session.tokenUser = token;
 res.json({redirect:"/painel"})
 
}

export const logout = (req,res)=>{
  req.session.destroy();
  res.redirect('/login');
}

export const forgetAction = async(req, res)=>{

    const user = await User.findOne({
        where:{
            email:req.body.email
        }
    })
    if(!user){
        res.json({message:'Usuário não encontrado',type:'error'});
        return;
    }

    const token = sign(
        {id:user.id,email:user.email},
        String(process.env.SECRET_KEY_JWT)
    )
    
    
    const link = `${process.env.URL_BASE}/altera-senha/${token}`;
    
     let emailTemplate = `<h2>Perdeu sua senha ${user.fullName} ?</h2>"
    <p>Você está recebendo este e-mail pois foi solicitado a recuperação de senha no site ${process.env.URL_BASE} </p>
    <p><a title='Recuperar Senha' href='${link}'> CLIQUE AQUI PARA CRIAR UMA NOVA SENHA</a></p>
    <p><b>IMPORTANTE:</b> Se não foi você que solicitou ignore o e-mail. Seus dados permanecem seguros.</p>`;

    

    //configurando o tranporte
    let transport = nodemailer.createTransport({
        host:'devbymarcos.com',
        port:'456',
        auth:{
            user:'marcos@devbymarcos.com',
            pass:'w91xQLnUk88A'
        }
    });
    // configura a menssagem
    let message = {
        from:'',
        to:'',
        subject:'',
        html:'',
        text:''
    }
    //envia a mensagem
    // let info = await transport.sendMail(message);
    // console.log(info)

    res.json({action:'processando'});
}

export const viewRecoveryPass = (req,res)=>{
    console.log(req.params)
}