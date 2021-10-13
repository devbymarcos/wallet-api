import { User } from '../models/User.js';


export const user = async(req,res)=>{
  let users = await User.findAll();
   return res.json({result: users});
}