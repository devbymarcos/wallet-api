import { prisma } from "../database/prismaClient.js";

class Wallet {
    constructor(obj) {
        this.id = obj.id || null;
        this.user_id = obj.user_id || null;
        this.name = obj.name || null;
        this.description = obj.description || null;
        this.option_wallet = obj.option_wallet || null;
    }

    async findyAll() {
        try {
            const dataDB = await prisma.app_wallet.findMany({
                where: {
                    user_id: this.user_id,
                },
            });
            if (dataDB.length <= 0) {
                return { data: null, message: "Não existe dados" };
            }

            return dataDB;
        } catch (err) {
            console.log(err);
        } finally {
            prisma.$disconnect();
        }
    }
    async findyById() {
        try {
            const wallet = await prisma.app_wallet.findUnique({
                where: {
                    id: parseInt(this.id),
                },
            });

            return wallet;
        } catch (err) {
            console.log(err);
        } finally {
            prisma.$disconnect();
        }
    }
}

export default Wallet;
