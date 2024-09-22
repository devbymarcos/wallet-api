import { prisma } from "../../database/prismaClient";
import { CategoryBase } from "./CategoryBase";
import { CategoryTypes } from "./types";

class CategoryFindAll extends CategoryBase {
    constructor(user_id: number) {
        super();
        this.user_id = user_id;
    }

    async execute() {
        try {
            const categories = await prisma.app_categories.findMany({
                where: {
                    user_id: this.user_id,
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

export default CategoryFindAll;
