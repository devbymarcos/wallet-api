import { prisma } from "../../database/prismaClient.js";
import { WalletTypes } from "./types";

class Wallet {
    id;
    user_id;
    name;
    description;
    option_wallet;

    constructor({
        id,
        user_id,
        name,
        description,
        option_wallet,
    }: WalletTypes) {
        this.id = id || undefined;
        this.user_id = user_id || undefined;
        this.name = name || "";
        this.description = description || "";
        this.option_wallet = option_wallet || 0;
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

    async getWalletBalance() {
        try {
            const walletBalance: Array<{
                name: string;
                balance: number;
            }> =
                await prisma.$queryRaw`SELECT w.name,(SUM(CASE WHEN i.type = 'income' THEN i.price ELSE 0 END) - SUM(CASE WHEN i.type = 'expense' THEN i.price ELSE 0 END)) AS balance FROM app_wallet w LEFT JOIN app_invoice i ON w.id = i.wallet_id WHERE w.user_id =${this.user_id} GROUP BY w.id, w.name`;

            return walletBalance;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

export default Wallet;
