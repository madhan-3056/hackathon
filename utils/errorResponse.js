/**
 * Custom error response class
 */
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default ErrorResponse;

// For CommonJS compatibility
if (typeof module !== 'undefined') {
    module.exports = ErrorResponse;
}