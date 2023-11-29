import validator from "validator";
import User from "../models/User.js";

export const getUser = async (req, res) => {
    const { id } = req.userSession;

    const props = {
        id: id,
    };
    const dataUser = new User(props);
    await dataUser.findById();
    console.log(dataUser.email);
    if (!dataUser.first_name) {
        res.json({ message: "Usuário nao encontrado", data: null });
    }
    const data = {
        id: dataUser.id,
        first_name: dataUser.first_name,
        last_name: dataUser.last_name,
        email: dataUser.email,
        photo: dataUser.photo,
    };
    res.json({ data });
};
export const registerUser = async (req, res) => {
    const dataObj = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
    };
    const createUser = new User(dataObj);
    const data = await createUser.register();
    if (!data) {
        res.json({
            message: "Não foi possivel criar, algo aconteceu contate o admin",
            typeError: true,
        });
        return;
    }

    res.json({ data });
};
//TODO Transferir acesso ao BD para o Model, criar métodos para realizaro update
export const updateUser = async (req, res) => {
    const { id } = req.userSession;
    const props = {
        id: id,
    };
    const user = new User(props);
    await user.findById();

    if (!user.first_name) {
        res.json({
            message: "Este user não esta registrado, não pode ser alterado",
            data: null,
        });
        return;
    }
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    user.password = req.body.password ? req.body.password : user.password;

    user.update();

    const data = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        photo: user.photo,
    };

    res.json({ data });
};
