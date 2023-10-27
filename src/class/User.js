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
                    id: this.id,
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

    findByEmail() {}

    register() {
        const existingUser = this.findByEmail();
    }
    update() {}

    async cryptpass() {
        if (this.password) {
            const passwordCrypt = await bcryptjs.hash(this.password, 10);
            return passwordCrypt;
        }
    }
}

export default User;
