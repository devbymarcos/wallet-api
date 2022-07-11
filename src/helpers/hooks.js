export function formatDateView(date) {
    const d = date.slice(0, 10);
    const [year, month, day] = d.split("-");
    return `${day}/${month}/${year}`;
}

export function formtaDatePrisma(date) {
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
