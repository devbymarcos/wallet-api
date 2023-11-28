import { prisma } from "../database/prismaClient.js";
import bcryptjs from "bcryptjs";
import validator from "validator";

class User {
    constructor(user) {
        this.id = user.id || null;
        this.first_name = user.first_name || null;
        this.last_name = user.last_name || null;
        this.email = user.email || null;
        this.password = user.password || null;
        this.photo = user.photo || "default";
    }

    async findById() {
        try {
            const userDb = await prisma.users.findUnique({
                where: {
                    id: parseInt(this.id),
                },
            });

            if (!userDb) return { data: null };

            const user = {
                id: userDb.id,
                first_name: userDb.first_name,
                last_name: userDb.last_name,
                email: userDb.email,
                photo: userDb.photo,
            };

            return user;
        } catch (err) {
            console.log(err);
        } finally {
            prisma.$disconnect();
        }
    }

    async findByEmail() {
        try {
            const userDb = await prisma.users.findUnique({
                where: {
                    email: this.email,
                },
            });

            if (!userDb) return { user: null };

            const user = {
                id: userDb.id,
                first_name: userDb.first_name,
                last_name: userDb.last_name,
                email: userDb.email,
                photo: userDb.photo,
            };

            return user;
        } catch (err) {
            console.log(err);
        } finally {
            prisma.$disconnect();
        }
    }

    async register() {
        const existingUser = await this.findByEmail();

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

            const user = {
                id: userCreate.id,
                first_name: userCreate.first_name,
                last_name: userCreate.last_name,
                email: userCreate.email,
                photo: userCreate.photo,
            };
            return user;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }
    async update() {
        try {
            const userCreate = await prisma.users.update({
                where: {
                    id: this.id,
                },
                data: {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    email: this.email,
                    password: await this.cryptpass(),
                },
            });

            const user = {
                id: userCreate.id,
                first_name: userCreate.first_name,
                last_name: userCreate.last_name,
                email: userCreate.email,
                photo: userCreate.photo,
            };
            return user;
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
            console.log(passwordCrypt);
            return passwordCrypt;
        }

        return false;
    }
}

export default User;
