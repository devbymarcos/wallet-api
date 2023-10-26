import { prisma } from "../database/prismaClient.js";
import bcryptjs from "bcryptjs";
import validator from "validator";

export const getUser = async (req, res) => {
    const { email } = req.userSession;

    const userDb = await prisma.users.findUnique({
        where: {
            email: email,
        },
    });
    if (!userDb) return res.json({ message: "User not found" });

    const user = {
        id: userDb.id,
        first_name: userDb.first_name,
        last_name: userDb.last_name,
        email: userDb.email,
        photo: userDb.photo,
    };

    res.json(user);
};
export const registerUser = async (req, res) => {
    if (!validator.isEmail(req.body.email)) {
        return res.json({
            message: "Insira um email válido",
        });
    }
    // verifica se existe user ja cadastrado com esse email
    try {
        const hasUserEmail = await prisma.users.findUnique({
            where: {
                email: req.body.email,
            },
        });
        console.log(hasUserEmail);
        if (hasUserEmail.id) {
            res.json({ message: "Usuário ja cadastrado com este email" });
        }
    } catch (err) {
        console.log(err);
    } finally {
        prisma.$disconnect();
    }

    const option = { ignore_whitespace: false };

    if (
        validator.isEmpty(req.body.first_name, option) &&
        validator.isEmpty(req.body.last_name, option)
    ) {
        return res.json({
            message: "Dados incorretos",
        });
    }

    const passwordCrypt = await bcryptjs.hash(req.body.password, 10);
    try {
        const user = await prisma.users.create({
            data: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: passwordCrypt,
            },
        });

        res.json({
            info: "ok",
        });
    } catch (erro) {
        console.log(erro);
        res.json({
            message: "Nao foi possível contate o admin",
            info: "Pode ser que o user ja existe, ou a senha precisa pelo menos 8 caracteres, 1 letra e 1 número",
        });
    } finally {
        prisma.$disconnect();
    }
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
