import { prisma } from "../../database/prismaClient";
import { CategoryBase } from "./CategoryBase";
import { CategoryTypes } from "./types";

class FindByIdCategory extends CategoryBase {
    constructor(id: number) {
        super();
        this.id = id;
    }

    async execute() {
        try {
            const category = await prisma.app_categories.findUnique({
                where: {
                    id: this.id,
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

export default FindByIdCategory;
