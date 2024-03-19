import User from "../../models/user-model/User.js";
import { dataReturn } from "../../helpers/functions.js";
import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
    const userObj = {
        id: res.locals.userAuth.id,
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    };
    const user = new User(userObj);
    const data = await user.findById();
    res.json(dataReturn(data, "user"));
};
export const registerUser = async (req: Request, res: Response) => {
    const userObj = {
        id: undefined,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
    };
    const user = new User(userObj);
    const data = await user.register();
    res.json(dataReturn(data, "user"));
};

export const updateUser = async (req: Request, res: Response) => {
    const userObj = {
        id: res.locals.userAuth.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: "",
    };
    const user = new User(userObj);
    const data = await user.update();
    res.json(dataReturn([data], "user"));
};

export const updatePassword = async (req: Request, res: Response) => {
    const userObj = {
        id: res.locals.userAuth.id,
        first_name: "",
        last_name: "",
        email: "",
        password: req.body.password,
    };
    const user = new User(userObj);
    const data = await user.updatePass();
    res.json(dataReturn(data, "/user"));
};
