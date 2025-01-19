interface ResponseData<T> {
    status: boolean;
    message: string;
    data?: T | null;
    errors?: unknown[] | null;
}

export function success<T>(message: string, data: T | null = null): ResponseData<T> {
    return {
        status: true,
        message,
        data,
        errors: null,
    };
}

export function error(message: string, errors: unknown[] | null = null): ResponseData<null> {
    return {
        status: false,
        message,
        data: null,
        errors,
    };
}

const response = { success, error };

export default response;
