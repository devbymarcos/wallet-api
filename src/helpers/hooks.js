export function formatDateView(date) {
    const d = date.slice(0, 10);
    const [year, month, day] = d.split("-");
    return `${day}/${month}/${year}`;
}
