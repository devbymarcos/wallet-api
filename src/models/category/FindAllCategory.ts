import { prisma } from "../../database/prismaClient";
import { CategoryBase } from "./CategoryBase";

class FindAllCategory extends CategoryBase {
    walletId!: number;
    constructor(user_id: number, walletId: number) {
        super();
        this.user_id = user_id;
        this.walletId = walletId;
    }

    async execute() {
        try {
            const categories = await prisma.app_categories.findMany({
                where: {
                    user_id: this.user_id,
                    wallet_id: this.walletId,
                },
            });

            return categories;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }
}

export default FindAllCategory;
