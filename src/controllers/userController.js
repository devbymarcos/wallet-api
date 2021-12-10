import { User } from "../models/User.js";
import sharp from "sharp";
import { unlink } from "fs/promises";
import bcryptjs from "bcryptjs";

export const viewRegister = (req, res) => {
    res.render("pages/widgets/user/user-create");
};
export const viewPerfil = async (req, res) => {
    const userSession = req.session.user;
    const findUser = await User.findByPk(userSession);

    const cover = findUser.photo === "default" ? false : true;

    const select = (type, value) => {
        return type == value ? "selected" : "";
    };

    const selMale = select(findUser.genre, "male");
    const selFemale = select(findUser.genre, "female");
    res.render("pages/widgets/user/user-perfil", {
        findUser,
        cover,
        selMale,
        selFemale,
    });
};

export const save = async (req, res) => {
    if (req.body.action && req.body.action === "update") {
        const findUser = await User.findByPk(req.body.user_id);

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
        const userCreate = await User.update(
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                genre: req.body.genre,
                datebirth: req.body.datebirth,
                document: req.body.document,
                photo: urlImage,
                password: passwordCrypt ? passwordCrypt : findUser.password,
            },
            {
                where: {
                    id: req.body.user_id,
                },
            }
        );

        res.json({ message: " registro atualizado", type: "success" });
        return;
    }
};
