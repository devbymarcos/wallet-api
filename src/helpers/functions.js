export function dataReturn(data, request = "", message = "") {
    if (!data) {
        return {
            data: null,
            message: message,
            request: request,
        };
    }
    if (data.length <= 0) {
        return {
            data: null,
            message: "não encontramos dados",
            request: request,
        };
    }
    return {
        data: data,
        message: message,
        request: request,
    };
}
