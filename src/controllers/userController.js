import validator from "validator";
import User from "../models/User.js";

export const getUser = async (req, res) => {
    const { id } = req.userSession;

    const props = {
        id: id,
    };
    const dataUser = new User(props);
    const user = await dataUser.findById();

    res.json(user);
};
export const registerUser = async (req, res) => {
    const props = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
    };
    const createUser = new User(props);
    const response = await createUser.register();
    if (!response) {
        res.json({
            message: "Não foi possivel criar, algo aconteceu contate o admin",
            typeError: true,
        });
        return;
    }

    res.json(response);
};
export const updateUser = async (req, res) => {
    const { id } = req.userSession;

    const findUser = await prisma.users.findUnique({
        where: {
            id: id,
        },
    });

    if (findUser.id != id) {
        res.json({
            maessage: "Este user não esta registrado, não pode ser alterado",
        });
        return;
    }

    let passwordCrypt;
    if (req.body.password) {
        passwordCrypt = await bcryptjs.hash(req.body.password, 10);
    }

    try {
        const userUpdate = await prisma.users.update({
            where: {
                id: id,
            },
            data: {
                first_name: req.body.first_name
                    ? req.body.first_name
                    : findUser.first_name,
                last_name: req.body.last_name
                    ? req.body.last_name
                    : findUser.last_name,
                email: req.body.email ? req.body.email : findUser.email,
                photo: "default",
                password: passwordCrypt ? passwordCrypt : findUser.password,
            },
        });

        res.json({
            user: {
                id: userUpdate.id,
                first_name: userUpdate.first_name,
                last_name: userUpdate.last_name,
                email: userUpdate.email,
                photo: userUpdate.photo,
            },
        });
        return;
    } catch (err) {
        console.log(err);
        res.json({
            message: " Não foi possivel atualizar contate o admin",
            type: "erro",
        });
    }
};
