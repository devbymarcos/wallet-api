import { prisma } from "../../database/prismaClient";
import { CategoryBase } from "./CategoryBase";
import { CategoryTypes } from "./types";

class CategoryUpdate extends CategoryBase {
    constructor({ id, name, type, description }: CategoryTypes) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
    }

    async execute() {
        try {
            const category = await prisma.app_categories.update({
                data: {
                    id: this.id,
                    name: this.name,
                    description: this.description,
                    type: this.type,
                },

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

export default CategoryUpdate;
