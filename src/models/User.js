import pkg from "sequelize";
const { DataTypes } = pkg;
import { sequelize } from "../instances/mysql.js";

export const User = sequelize.define(
    "User",
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        genre: {
            type: DataTypes.STRING,
        },
        full_name: {
            type: DataTypes.VIRTUAL,
            get() {
                let fisrtName = this.getDataValue("first_name");
                let lastName = this.getDataValue("last_name");
                return fisrtName + "" + lastName;
            },
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        level: {
            type: DataTypes.INTEGER,
        },
        datebirth: {
            type: DataTypes.DATE,
        },
        document: {
            type: DataTypes.STRING,
        },
        photo: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: "users",
        timestamps: false,
    }
);
