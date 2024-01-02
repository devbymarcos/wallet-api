import { prisma } from "../database/prismaClient.js";

class Category {
    id;
    user_id;
    name;
    description;
    type;

    constructor(obj) {
        this.id = obj.id || null;
        this.user_id = obj.user_id || null;
        this.name = obj.name || null;
        this.description = obj.description || null;
        this.type = obj.type || null;
    }

    async findById() {
        try {
            const category = prisma.app_categories.findUnique({
                where: {
                    id: parseInt(this.id),
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
                    user_id: parseInt(this.user_id),
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
                    id: parseInt(this.id),
                },
            });
            console.log(category);
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
                    id: parseInt(this.id),
                    name: this.name,
                    description: this.description,
                    type: this.type,
                },

                where: {
                    id: parseInt(this.id),
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
