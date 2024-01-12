import { prisma } from "../database/prismaClient.js";
import { WalletTypes } from "./modelsType.js";
class Wallet {
    id;
    user_id;
    name;
    description;
    option_wallet;

    constructor(obj: WalletTypes) {
        this.id = obj.id || undefined;
        this.user_id = obj.user_id || undefined;
        this.name = obj.name || "";
        this.description = obj.description || "";
        this.option_wallet = obj.option_wallet || 0;
    }

    async findyAll() {
        try {
            const wallet = await prisma.app_wallet.findMany({
                where: {
                    user_id: this.user_id,
                },
            });

            return wallet;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }
    async findyById() {
        try {
            const wallet = await prisma.app_wallet.findUnique({
                where: {
                    id: this.id,
                },
            });

            return [wallet];
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }

    async remove() {
        try {
            const wallet = await prisma.app_wallet.delete({
                where: {
                    id: this.id,
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

    async update() {
        try {
            const wallet = prisma.app_wallet.update({
                where: {
                    id: this.id,
                },
                data: {
                    name: this.name,
                    description: this.description,
                    option_wallet: this.option_wallet,
                },
            });

            return wallet;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }
    async register() {
        try {
            const wallet = await prisma.app_wallet.create({
                data: {
                    user_id: this.user_id,
                    name: this.name,
                    description: this.description,
                    option_wallet: this.option_wallet,
                },
            });

            return [wallet];
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }
}

export default Wallet;
