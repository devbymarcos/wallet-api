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
            const dataDB = await prisma.app_wallet.findUnique({
                where: {
                    id: this.id,
                },
            });

            if (!dataDB) return { data: null, message: "Não existe dados" };

            const wallet = {
                id: dataDB.id,
                name: dataDB.name,
                description: dataDB.description,
                option_wallet: dataDB.option_wallet,
            };

            return wallet;
        } catch (err) {
            console.log(err);
        } finally {
            prisma.$disconnect();
        }
    }
}

export default Wallet;
