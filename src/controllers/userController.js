import { User } from '../models/User.js';


export const viewRegister = (req,res)=>{

    res.render('pages/widgets/user/user-create')

}
export const viewPerfil = async(req,res)=>{
    const userSession = req.session.user;
    const findUser =  await User.findByPk(userSession);
   
    const cover =  (findUser.photo === 'default' ? false  : true);

    const select = (type,value)=>{
        return(type == value ? 'selected' : '');
    }
  
    const selMale = select(findUser.genre,'male');
    const selFemale = select(findUser.genre,'female');
    res.render('pages/widgets/user/user-perfil',{
        findUser,
        cover,
        selMale,
        selFemale
    })

}

export const save = async(req,res)=>{

    res.json({retorno:'deutudo certo'});
}