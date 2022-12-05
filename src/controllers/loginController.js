import { prisma } from "../database/prismaClient.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

dotenv.config();

export const loginAuth = async (req, res) => {
    console.log(req.body.email);
    const user = await prisma.users.findUnique({
        where: { email: req.body.email },
    });
    console.log("🚀 ~ file: loginController.js:14 ~ loginAuth ~ user", user);

    if (!user) {
        res.json({ message: "Usuário não está registrado", type: "error" });
        return;
    }

    let passwdCheck = await bcryptjs.compare(req.body.passwd, user.password);

    if (!passwdCheck) {
        res.json({ message: "Usuário e senha não confere", type: "error" });
        return;
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        String(process.env.SECRET_KEY_JWT),
        {
            expiresIn: 86400,
        }
    );

    res.json({
        user: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            photo: user.photo,
            token: token,
        },
    });
};

export const forgetAction = async (req, res) => {
    const user = await prisma.users.findFirst({
        where: {
            email: req.body.email,
        },
    });
    if (!user) {
        res.json({ message: "Usuário não encontrado", type: "error" });
        return;
    }

    const token = sign(
        { id: user.id, email: user.email },
        String(process.env.SECRET_KEY_JWT),
        {
            expiresIn: 300,
        }
    );

    const link = `${process.env.URL_BASE}/altera-senha?token=${token}`;

    let emailTemplate = `<h2>Perdeu sua senha ${user.full_name} ?</h2>
    <p>Você está recebendo este e-mail pois foi solicitado a recuperação de senha no site ${process.env.URL_BASE} </p>
    <p><a title='Recuperar Senha' href='${link}'> CLIQUE AQUI PARA CRIAR UMA NOVA SENHA</a>
    </p>
    <p><b>IMPORTANTE:</b> Se não foi você que solicitou ignore o e-mail. Seus dados permanecem seguros.</p>`;

    //configurando o tranporte
    let transport = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 465,
        secure: true,
        auth: {
            user: "apikey",
            pass: process.env.API_KEY_SENDGRID,
        },
    });
    // configura a menssagem
    let message = {
        from: "marcos@devbymarcos.com",
        to: user.email,
        subject: "Mycontrol",
        html: emailTemplate,
        text: "um simples teste de envio",
    };
    // envia a mensagem
    try {
        let info = await transport.sendMail(message);
        console.log(info);
    } catch (err) {
        console.log("erro de envio:", err);
    }

    res.json({ action: "processando" });
};
