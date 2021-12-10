import { User } from "../models/User.js";
import sharp from "sharp";

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
    console.log(req.files);

    if (req.body.action && req.body.action === "update") {
        let urlImage = "";
        if (req.files.length > 0) {
            await sharp(req.files[0].path)
                .resize(300)
                .toFormat("jpeg")
                .toFile(`./public/storage/${req.files[0].filename}`);
            urlImage = `storage/${req.files[0].filename}`;
        } else {
            urlImage = req.body.file_dir;
        }

        const userCreate = User.update(
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                genre: req.body.genre,
                datebirth: req.body.datebirth,
                document: req.body.document,
                photo: urlImage,
            },
            {
                where: {
                    id: req.body.user_id,
                },
            }
        );

        res.json({ message: "Registro atualizado", type: "success" });
        return;
    }
};
