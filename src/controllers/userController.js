import { prisma } from "../database/prismaClient.js";
import bcryptjs from "bcryptjs";
import sharp from "sharp";
import { unlink } from "fs/promises";

export const getUser = async (req, res) => {
    const { id, email } = req.userSession;
    const userDb = await prisma.users.findUnique({
        where: {
            email: email,
        },
    });
    if (!userDb) return res.json({ message: "User not found" });

    const user = {
        first_name: userDb.first_name,
        last_name: userDb.last_name,
        email: userDb.email,
        photo: userDb.photo,
    };

    res.json({
        user,
    });
};

export const save = async (req, res) => {
    const { id, email } = req.userSession;

    if (!req.body.action) {
        res.json({
            message: "campo action não encontrado",
            field_value_update: `action = "update" para atualizar dados do user`,
            filed_value_upload: `action = "upload" para upload de avatar`,
        });
        return;
    }

    //UPDATE
    if (req.body.action && req.body.action === "update") {
        const findUser = await prisma.users.findUnique({
            where: {
                id: id,
            },
        });

        //cria has de senha se existir uma nova senha insrida pelo user
        let passwordCrypt = false;
        if (req.body.passwd) {
            passwordCrypt = await bcryptjs.hash(req.body.passwd, 10);
        }
        //modificador de imagem avatar
        let urlImage = "";
        if (req.files.length > 0) {
            if (findUser.photo) {
                await unlink(`./public/${findUser.photo}`);
            }
            await sharp(req.files[0].path)
                .resize(300)
                .toFormat("jpeg")
                .toFile(`./public/storage/${req.files[0].filename}`);
            urlImage = `storage/${req.files[0].filename}`;
            await unlink(req.files[0].path);
        } else {
            urlImage = findUser.photo;
        }
        // End modificador de imagem avatar
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
                    photo: urlImage,
                    password: passwordCrypt ? passwordCrypt : findUser.password,
                },
            });

            res.json({
                user: {
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
    }

    if (req.body.action && req.body.action === "upload") {
        const findUser = await prisma.users.findUnique({
            where: {
                id: id,
            },
        });
        //modificador de imagem avatar
        let urlImage = "";
        if (req.files.length > 0) {
            if (findUser.photo) {
                await unlink(`./public/${findUser.photo}`);
            }
            await sharp(req.files[0].path)
                .resize(300)
                .toFormat("jpeg")
                .toFile(`./public/storage/${req.files[0].filename}`);
            urlImage = `storage/${req.files[0].filename}`;
            await unlink(req.files[0].path);
        } else {
            res.json({
                message: "arquivo não enviado",
                type: "error",
            });
            return;
        }

        try {
            const userUpdate = await prisma.users.update({
                where: {
                    id: id,
                },
                data: {
                    photo: urlImage,
                },
            });

            res.json({
                user: {
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
                message: "não foi possivel alterar a imagem, contate o admin",
                type: "erro",
            });
        }
    }
};
