import pkg from 'sequelize';
const { DataTypes } = pkg;
import { sequelize } from '../instances/mysql.js';

export const User  = sequelize.define("User",{
  id:{
    primaryKey:true,
    type:DataTypes.INTEGER
  },
  first_name:{
    type:DataTypes.STRING
  },
  last_name:{
    type:DataTypes.STRING
  },
  email:{
    type:DataTypes.STRING
  },
  password:{
    type:DataTypes.STRING
  },
  level:{
    type:DataTypes.INTEGER
  },
  forget:{
    type:DataTypes.STRING
  },
  date_link_forget:{
    type:DataTypes.STRING
  },
  datebirth:{
    type:DataTypes.DATE  
  },
  document:{
    type:DataTypes.STRING
  },
  photo:{
    type:DataTypes.STRING
  },
  status:{
    type:DataTypes.STRING
  },
  

},{
  tableName: 'users',
  timestamps: false
})