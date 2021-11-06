import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User }  from '../models/User.js'
const { verify } = jwt;
dotenv.config();

export const privateRouter = async(req,res,next)=>{
    
    
    if(!req.session.tokenUser){
        res.redirect("/login");
    }
    let decode ='';
    try{
        decode = verify(
            req.session.tokenUser,
            String(process.env.SECRET_KEY_JWT)
        )
    }catch(err){
        console.log('Token não aceito')
    }
      
    const user =  await User.findOne({
        where:{
            id:decode.id,
            email:decode.email
        }
    });
    
    if(!user){
        res.redirect("/login");
        return
    }
  
    req.session.user = user.id
    req.session.fullName = user.full_name
    return next();
}