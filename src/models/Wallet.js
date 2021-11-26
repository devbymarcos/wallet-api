import pkg from "sequelize";
const { DataTypes } = pkg;
import { sequelize } from "../instances/mysql.js";

export const Wallet = sequelize.define(
    "Wallet",
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        name: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        option_wallet: {
            type: DataTypes.INTEGER,
        },
    },
    {
        tableName: "app_wallet",
        timestamps: false,
    }
);
// Wallet.sync({ force: false }).then(() => {
//     console.log("create table: app_wallet");
// });
