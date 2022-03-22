export class TimeoutError extends Error {
    constructor(request) {
        super('Request timed out');
        this.name = 'TimeoutError';
        this.request = request;
    }
}
//# sourceMappingURL=TimeoutError.js.map