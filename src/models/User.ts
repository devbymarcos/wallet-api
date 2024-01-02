import { prisma } from "../database/prismaClient.js";
import bcryptjs from "bcryptjs";
import validator from "validator";

class User {
    constructor({ id, first_name, last_name, email, password, photo }) {
        this.id = id || null;
        this.first_name = first_name || null;
        this.last_name = last_name || null;
        this.email = email || null;
        this.password = password || null;
        this.photo = photo || "default";
    }

    async findById() {
        try {
            const user = await prisma.users.findUnique({
                where: {
                    id: parseInt(this.id),
                },
            });

            const data = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                photo: user.photo,
            };
            return data;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }

    async hasEmail() {
        try {
            const user = await prisma.users.findUnique({
                where: {
                    email: this.email,
                },
            });

            if (!user) return false;

            return true;
        } catch (err) {
            console.log(err);
        } finally {
            prisma.$disconnect();
        }
    }

    async register() {
        const existingUser = await this.hasEmail();

        if (!existingUser) {
            return false;
        }

        try {
            const userCreate = await prisma.users.create({
                data: {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    email: this.email,
                    password: await this.cryptpass(),
                },
            });

            const data = {
                id: userCreate.id,
                first_name: userCreate.first_name,
                last_name: userCreate.last_name,
                email: userCreate.email,
                photo: userCreate.photo,
            };
            return data;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }
    async update() {
        try {
            const user = await prisma.users.update({
                where: {
                    id: parseInt(this.id),
                },
                data: {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    email: this.email,
                },
            });
            const data = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                photo: user.photo,
            };
            return data;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }

    async cryptpass() {
        if (this.password) {
            const passwordCrypt = await bcryptjs.hash(this.password, 10);

            return passwordCrypt;
        }

        return false;
    }

    async updatePass() {
        try {
            const user = await prisma.users.update({
                where: {
                    id: parseInt(this.id),
                },
                data: {
                    password: await this.cryptpass(),
                },
            });

            return true;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }
}

export default User;
