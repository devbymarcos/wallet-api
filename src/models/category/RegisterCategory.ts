import { prisma } from "../../database/prismaClient";
import { CategoryBase } from "./CategoryBase";
import { CategoryTypes } from "./types";

class RegisterCategory extends CategoryBase {
    walletId?: number;

    constructor({
        id,
        name,
        type,
        user_id,
        description,
        wallet_id,
    }: CategoryTypes) {
        super();
        this.id = id;
        this.name = name;
        this.type = type;
        this.user_id = user_id;
        this.description = description;
        this.walletId = wallet_id;
    }

    async execute() {
        try {
            const category = await prisma.app_categories.create({
                data: {
                    user_id: this.user_id,
                    name: this.name,
                    description: this.description,
                    type: this.type,
                    wallet_id: this.walletId,
                },
            });

            return category;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            prisma.$disconnect();
        }
    }
}

export default RegisterCategory;
