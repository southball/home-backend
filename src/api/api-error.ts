class ApiError extends Error {
    constructor(message: string, ...params: any[]) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }

        this.name = 'ApiError';
    }
}

export default ApiError;
