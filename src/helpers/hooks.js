export function formatDateView(date) {
    if (typeof date != "string") {
        const dview = new Date(date);
        const day = dview.getUTCDate();
        const year = dview.getUTCFullYear();
        const month = dview.getUTCMonth();
        return `${day}/${month}/${year}`;
    } else {
        const d = String(date).slice(0, 10);
        const [year, month, day] = d.split("-");
        return `${day}/${month}/${year}`;
    }
}

export function formatDatePrisma(date) {
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
