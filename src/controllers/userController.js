import { User } from '../models/User.js';


export const viewRegister = (req,res)=>{

    res.render('pages/widgets/user/user-create')

}
export const viewPerfil = async(req,res)=>{
    const userSession = req.session.user;
    const findUser =  await User.findByPk(userSession);
    console.log(findUser);
    const cover =  (findUser.photo === 'default' ? false  : true);
    console.log(cover);
    res.render('pages/widgets/user/user-perfil',{
        findUser,
        cover
    })

}