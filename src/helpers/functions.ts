export function dataReturn(
    data: any[] | boolean | object,
    request: string,
    message: string = ""
) {
    if (!data) {
        return {
            data: [false],
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
