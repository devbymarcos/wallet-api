import pkg from 'sequelize';
const { DataTypes, QueryTypes } = pkg;
import { sequelize } from '../instances/mysql.js';

export const Invoice = sequelize.define('Invoice',{
  id:{
    primaryKey:true,
    type:DataTypes.INTEGER,
    autoIncrement: true
  },
  user_id:{
    type:DataTypes.INTEGER
  },
  wallet_id:{
    type:DataTypes.INTEGER
  },
  category_id:{
    type:DataTypes.INTEGER
  },
  name:{
      type:DataTypes.STRING,
      defaultValue: 'Invoice'
  },
  invoice_of:{
    type:DataTypes.INTEGER
  },
  description:{
    type:DataTypes.STRING
  },
  price:{
    type:DataTypes.FLOAT
  },
  due_at:{
    type:DataTypes.DATE
  },
  type:{
    type:DataTypes.STRING
  },
  pay:{
    type:DataTypes.STRING,
    defaultValue:'unpaid'
  },
  repeat_when:{
    type:DataTypes.STRING
  },
  period:{
    type:DataTypes.STRING,
    defaultValue:'month'
  },
  group_quota:{
    type:DataTypes.STRING
  }
},{
  tableName: 'app_invoice',
  timestamps: false
})

