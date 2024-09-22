import { prisma } from "../../database/prismaClient";
import { CategoryBase } from "./CategoryBase";
import { CategoryTypes } from "./types";

class CategoryRegister extends CategoryBase {
    constructor({ id, name, type, user_id, description }: CategoryTypes) {
        super();
        this.id = id;
        this.name = name;
        this.type = type;
        this.user_id = user_id;
        this.description = description;
    }

    async execute() {
        try {
            const category = await prisma.app_categories.create({
                data: {
                    user_id: this.user_id,
                    name: this.name,
                    description: this.description,
                    type: this.type,
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

export default CategoryRegister;
