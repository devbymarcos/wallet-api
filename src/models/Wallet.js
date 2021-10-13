import pkg from 'sequelize';
const { DataTypes } = pkg;
import { sequelize } from '../instances/mysql.js';

export const Wallet = sequelize.define('Wallet',{
  id:{
    primaryKey:true,
    type:DataTypes.INTEGER,
    autoIncrement: true
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

},{
  tableName: 'app_wallet',
  timestamps: false
})