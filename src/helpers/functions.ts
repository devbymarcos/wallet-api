export function dataReturn(
    data: any[] | boolean | null | object,
    request: string,
    message: string = ""
) {
    if (data == null || !data) {
        return {
            data: null,
            message: "Record not found",
            request: request,
        };
    }
    if (Array.isArray(data) && data.length <= 0) {
        return {
            data: null,
            message: "Record not found",
            request: request,
        };
    }

    return {
        data: data,
        message: message,
        request: request,
    };
}

export function formatMonths(month: number): string | undefined {
    const dataMonths: { [key: number]: string } = {
        1: "Jan",
        2: "Fev",
        3: "Mar",
        4: "Abr",
        5: "Mai",
        6: "Jun",
        7: "Jul",
        8: "Ago",
        9: "Set",
        10: "Out",
        11: "Nov",
        12: "Dez",
    };

    // Verifica se o mês está no intervalo válido
    return dataMonths[month] || undefined;
}
