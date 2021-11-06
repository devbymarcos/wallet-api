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
        String(process.env.SECRET_KEY_JWT),
        {
           expiresIn: 300
        }
    )
    
    
    const link = `${process.env.URL_BASE}/altera-senha?token=${token}`;
    
     let emailTemplate = `<h2>Perdeu sua senha ${user.full_name} ?</h2>
    <p>Você está recebendo este e-mail pois foi solicitado a recuperação de senha no site ${process.env.URL_BASE} </p>
    <p><a title='Recuperar Senha' href='${link}'> CLIQUE AQUI PARA CRIAR UMA NOVA SENHA</a>
    </p>
    <p><b>IMPORTANTE:</b> Se não foi você que solicitou ignore o e-mail. Seus dados permanecem seguros.</p>`;

     

    //configurando o tranporte
    let transport = nodemailer.createTransport({
        host:'smtp.sendgrid.net',
        port:465,
        secure:true,
        auth:{
            user:'apikey',
            pass:process.env.API_KEY_SENDGRID
        }
    });
    // configura a menssagem
    let message = {
        from:"marcos@devbymarcos.com",
        to:user.email,
        subject:"Mycontrol",
        html:emailTemplate,
        text:'um simples teste de envio'
    }
    // envia a mensagem
    try{
        let info = await transport.sendMail(message);
        console.log(info)
    }catch(err){
        console.log("erro de envio:" ,err)
    }
    

    res.json({action:'processando'});
}

export const viewRecoveryPass = async(req,res)=>{
    
    const tokenRecoveryPass = req.query.token;
    let decode = '';
    try{
        decode = verify(
            tokenRecoveryPass,
            String(process.env.SECRET_KEY_JWT)
        )
    }catch(err){
        console.log('erro:',err)
        res.status(404)
        res.send("Link expirado ou invalido solicite novamente");
    }
    
    const user  = await User.findByPk(decode.id);
    if(!user){
        res.status(404)
        res.send("Link expirado ou invalido solicite novamente");
    }

    if(user.email != decode.email){
        res.status(404)
        res.send("Link expirado ou invalido solicite novamente 3");
    }

    res.render("pages/widgets/login/recovery-passwd");
}