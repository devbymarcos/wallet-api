import validator from "validator";
import User from "../models/User.js";
import { dataReturn } from "../helpers/functions.js";

export const getUser = async (req, res) => {
    const userObj = {
        id: req.userAuth.id,
    };
    const user = new User(userObj);
    const data = await user.findById();
    res.json(dataReturn(data, "user"));
};
export const registerUser = async (req, res) => {
    const userObj = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
    };
    const user = new User(userObj);
    const data = await user.register();
    res.json(dataReturn(data, "user"));
};

export const updateUser = async (req, res) => {
    const userObj = {
        id: req.userAuth.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
    };
    const user = new User(userObj);
    const data = await user.update();
    res.json(dataReturn(data, "user"));
};

export const updatePassword = async (req, res) => {
    const userObj = {
        id: req.userAuth.id,
        password: req.body.password,
    };
    const user = new User(userObj);
    const data = await user.updatePass();
    res.json(dataReturn(data, "user"));
};
