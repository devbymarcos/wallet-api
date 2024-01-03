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
