import { User } from '../models/User.js';


export const viewRegister = (req,res)=>{

    res.render('pages/widgets/user/user-create')

}
export const viewPerfil = (req,res)=>{

    res.render('pages/widgets/user/user-perfil')

}