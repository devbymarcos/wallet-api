export function formatDateView(date: string) {
    const data = new Date(date);
    return data.toLocaleDateString("pt-BR");
}

export function formatDatePrisma(date: string) {
    const d = new Date(date);
    const day = d.getUTCDate();
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();

    return {
        day,
        year,
        month,
    };
}
