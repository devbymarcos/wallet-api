import { prisma } from "../../database/prismaClient";
import { CategoryTypes } from "./types";

class Category {
    id;
    user_id;
    name;
    description;
    type;

    constructor(obj: CategoryTypes) {
        this.id = obj.id || undefined;
        this.user_id = obj.user_id || undefined;
        this.name = obj.name || "";
        this.description = obj.description || "";
        this.type = obj.type || "";
    }

    async findById() {
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

    async findAll() {
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

    async register() {
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

    async delete() {
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

    async update() {
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

export default Category;
