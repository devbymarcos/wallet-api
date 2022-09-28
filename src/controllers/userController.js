import { prisma } from "../database/prismaClient.js";
import bcryptjs from "bcryptjs";
import sharp from "sharp";
import { unlink } from "fs/promises";

export const getUser = async (req, res) => {
    const { id, email } = req.userSession;
    const user = await prisma.users.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) return res.json({ message: "User not found" });

    res.json({
        user,
    });
};

export const save = async (req, res) => {
    const { id, email } = req.userSession;

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
        //upload de imagen avatar
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
        // End upload de imagen avatar
        try {
            const userUpdate = await prisma.users.update({
                where: {
                    id: id,
                },
                data: {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    photo: urlImage,
                    password: passwordCrypt ? passwordCrypt : findUser.password,
                },
            });

            res.json({ message: " registro atualizado", type: "success" });
            return;
        } catch (err) {
            console.log(err);
            res.json({
                message: " Não foi possivel atualizar contate o admin",
                type: "erro",
            });
        }
    }
};
