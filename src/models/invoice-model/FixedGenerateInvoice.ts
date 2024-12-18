import { prisma } from "../../database/prismaClient";
import { InvoiceBase } from "./InvoiceBase";
import { IInvoiceList } from "./types";

export class FixedGenerateInvoice extends InvoiceBase {
    constructor({ user_id, wallet_id }: IInvoiceList) {
        super();
        this.user_id = user_id;
        this.wallet_id = wallet_id;
    }

    private async findFixedInvoice() {
        const invoiceFixed = await prisma.app_fixed.findMany({
            where: {
                user_id: this.user_id,
                wallet_id: this.wallet_id,
                active: 1,
            },
        });

        return invoiceFixed;
    }

    private async fixedTableinvoice() {
        const fixedInvoice: any =
            await prisma.$queryRaw`SELECT * FROM app_invoice WHERE type IN ('fixed_income','fixed_expense') AND YEAR(due_at) = YEAR(CURDATE()) AND MONTH(due_at) = MONTH(CURDATE())`;
        return fixedInvoice;
    }

    async execute() {
        const [appFixed, appInvoice] = await Promise.all([
            this.findFixedInvoice(),
            this.fixedTableinvoice(),
        ]);

        console.log("FIXED", appFixed);
        console.log("INVOICE", appInvoice);

        const data = appFixed.filter(
            (appFixed) =>
                !appInvoice.some(
                    (appInvoice: any) => appFixed.id === appInvoice.invoice_of
                )
        );
        console.log("RESULT", data);
    }
}
