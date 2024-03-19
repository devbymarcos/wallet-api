import { categorySumType } from "../../controllers/report-controller/types-controller";
import { prisma } from "../../database/prismaClient";

class ReportModel {
    static async sumCategoryGroup(
        wallet_id: string,
        type_invoice: string
    ): Promise<categorySumType[]> {
        const categorySumGroup: any =
            await prisma.$queryRaw`SELECT c.id, c.name,
        SUM(CASE WHEN i.type = ${type_invoice} AND MONTH(i.due_at) = 1 THEN i.price ELSE 0 END) AS janeiro,
        SUM(CASE WHEN i.type = ${type_invoice} AND MONTH(i.due_at) = 2 THEN i.price ELSE 0 END) AS fevereiro,
        SUM(CASE WHEN i.type = ${type_invoice} AND MONTH(i.due_at) = 3 THEN i.price ELSE 0 END) AS marco,
        SUM(CASE WHEN i.type = ${type_invoice} AND MONTH(i.due_at) = 4 THEN i.price ELSE 0 END) AS abri,
        SUM(CASE WHEN i.type = ${type_invoice} AND MONTH(i.due_at) = 5 THEN i.price ELSE 0 END) AS maio,
        SUM(CASE WHEN i.type = ${type_invoice} AND MONTH(i.due_at) = 6 THEN i.price ELSE 0 END) AS junho,
        SUM(CASE WHEN i.type = ${type_invoice} AND MONTH(i.due_at) = 7 THEN i.price ELSE 0 END) AS julho,
        SUM(CASE WHEN i.type = ${type_invoice} AND MONTH(i.due_at) = 8 THEN i.price ELSE 0 END) AS agosto,
        SUM(CASE WHEN i.type = ${type_invoice} AND MONTH(i.due_at) = 9 THEN i.price ELSE 0 END) AS setembro,
        SUM(CASE WHEN i.type = ${type_invoice} AND MONTH(i.due_at) = 10 THEN i.price ELSE 0 END) AS outubro,
        SUM(CASE WHEN i.type = ${type_invoice} AND MONTH(i.due_at) = 11 THEN i.price ELSE 0 END) AS novembro,
        SUM(CASE WHEN i.type = ${type_invoice} AND MONTH(i.due_at) = 12 THEN i.price ELSE 0 END) AS dezembro
 FROM app_invoice i
 JOIN app_categories c ON i.category_id = c.id
 WHERE i.pay="paid" AND YEAR(i.due_at) =  YEAR(CURDATE()) AND wallet_id = ${wallet_id} AND c.type = ${type_invoice}
 GROUP BY c.id, c.name;`;

        return categorySumGroup;
    }
}

export default ReportModel;
