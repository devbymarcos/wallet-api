import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { dataReturn } from "../helpers/functions.js";

dotenv.config();

export const loginAuth = async (req: Request, res: Response) => {
    const userObj = {
        id: 0,
        first_name: "",
        last_name: "",
        password: "",
        email: req.body.email,
    };

    const user = new User(userObj);
    const data = await user.hasEmail();
    if (!data) {
        res.json(
            dataReturn({ user: false }, "/login", "Usuário não cadastrado")
        );
        return;
    }

    let passwdCheck = await bcryptjs.compare(req.body.password, data.password);

    if (!passwdCheck) {
        res.json(
            dataReturn({ user: false }, "/login", "Usuário e senha não confere")
        );
        return;
    }

    const token = jwt.sign(
        { id: data.id, email: user.email },
        String(process.env.SECRET_KEY_JWT),
        {
            expiresIn: 86400,
        }
    );
    const userData = [
        {
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            photo: data.photo,
            token: token,
        },
    ];
    res.json({
        data: userData,
        message: "",
        request: "/login",
    });
};

// export const forgetAction = async (req:Request, res:Response) => {
//     const user = await prisma.users.findFirst({
//         where: {
//             email: req.body.email,
//         },
//     });
//     if (!user) {
//         res.json({ message: "Usuário não encontrado", type: "error" });
//         return;
//     }

//     const token = sign(
//         { id: user.id, email: user.email },
//         String(process.env.SECRET_KEY_JWT),
//         {
//             expiresIn: 300,
//         }
//     );

//     const link = `${process.env.URL_BASE}/altera-senha?token=${token}`;

//     let emailTemplate = `<h2>Perdeu sua senha ${user.full_name} ?</h2>
//     <p>Você está recebendo este e-mail pois foi solicitado a recuperação de senha no site ${process.env.URL_BASE} </p>
//     <p><a title='Recuperar Senha' href='${link}'> CLIQUE AQUI PARA CRIAR UMA NOVA SENHA</a>
//     </p>
//     <p><b>IMPORTANTE:</b> Se não foi você que solicitou ignore o e-mail. Seus dados permanecem seguros.</p>`;

//     //configurando o tranporte
//     let transport = nodemailer.createTransport({
//         host: "smtp.sendgrid.net",
//         port: 465,
//         secure: true,
//         auth: {
//             user: "apikey",
//             pass: process.env.API_KEY_SENDGRID,
//         },
//     });
//     // configura a menssagem
//     let message = {
//         from: "marcos@devbymarcos.com",
//         to: user.email,
//         subject: "Mycontrol",
//         html: emailTemplate,
//         text: "um simples teste de envio",
//     };
//     // envia a mensagem
//     try {
//         let info = await transport.sendMail(message);
//         console.log(info);
//     } catch (err) {
//         console.log("erro de envio:", err);
//     }

//     res.json({ action: "processando" });
// };
