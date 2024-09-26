import { prisma } from "../../database/prismaClient";
import { CategoryBase } from "./CategoryBase";

class RemoveCategory extends CategoryBase {
    constructor(id: number) {
        super();
        this.id = id;
    }

    async execute() {
        try {
            const category = await prisma.app_categories.delete({
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
}

export default RemoveCategory;
