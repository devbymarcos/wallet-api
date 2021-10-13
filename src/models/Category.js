import pkg from 'sequelize';
const { DataTypes } = pkg;
import { sequelize } from '../instances/mysql.js';

export const Category = sequelize.define('Category',{
  id:{
    primaryKey:true,
    type:DataTypes.INTEGER,
    autoIncrement:true
  },
  user_id:{
    type:DataTypes.INTEGER
  },
  name:{
    type:DataTypes.STRING
  },
  description:{
    type:DataTypes.STRING
  },
  type:{
    type:DataTypes.STRING
  },
},{
  tableName: 'app_categories',
  timestamps: false
})