export function dataReturn(
    data: any[] | boolean | object,
    request: string,
    message: string = ""
) {
    if (!data) {
        return {
            data: null,
            message: "Algo aconteceu contate o admin",
            request: request,
        };
    }

    return {
        data: data,
        message: message,
        request: request,
    };
}
