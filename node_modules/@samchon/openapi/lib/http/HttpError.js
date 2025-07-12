"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
/**
 * Specialized error class for HTTP request failures
 *
 * `HttpError` is a custom error class that is thrown when an HTTP request fails
 * and receives an error response from a remote server. Unlike the standard
 * Error class, it carries detailed HTTP-specific information (method, path,
 * status code, headers) that enables more sophisticated error handling and
 * debugging in HTTP communication scenarios.
 *
 * This class is particularly useful for:
 *
 * - API client libraries that need to provide detailed error information
 * - Applications that require different handling based on HTTP status codes
 * - Logging and monitoring systems that need structured error data
 * - Debugging HTTP communication issues
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
class HttpError extends Error {
    /**
     * Creates a new HttpError instance
     *
     * Initializes an HttpError with comprehensive information about the failed
     * HTTP request. This constructor calls the parent Error constructor to set
     * the basic error message, and additionally stores HTTP-specific details as
     * readonly properties for later access.
     *
     * @example
     *   ```typescript
     *   const error = new HttpError(
     *     'POST',
     *     '/api/login',
     *     401,
     *     { 'content-type': 'application/json', 'www-authenticate': 'Bearer' },
     *     '{"error": "Invalid credentials", "code": "AUTH_FAILED"}'
     *   );
     *   console.log(error.status); // 401
     *   console.log(error.method); // "POST"
     *   ```;
     *
     * @param method The HTTP method that was used for the request (GET, POST,
     *   PUT, DELETE, PATCH, HEAD)
     * @param path The path or URL that was requested (e.g., '/api/users' or
     *   'https://api.example.com/users')
     * @param status The HTTP status code returned by the server (e.g., 404, 500,
     *   401)
     * @param headers The HTTP response headers returned by the server as
     *   key-value pairs
     * @param message The error message from the server (typically the response
     *   body text)
     */
    constructor(method, path, status, headers, message) {
        super(message);
        /** @internal */
        this.body_ = NOT_YET;
        this.method = method;
        this.path = path;
        this.status = status;
        this.headers = headers;
        // INHERITANCE POLYFILL
        const proto = new.target.prototype;
        if (Object.setPrototypeOf)
            Object.setPrototypeOf(this, proto);
        else
            this.__proto__ = proto;
    }
    /**
     * Serializes the HttpError instance to a JSON-compatible object
     *
     * This method serves two primary purposes:
     *
     * 1. **Automatic serialization**: When `JSON.stringify()` is called on an
     *    HttpError, this method is automatically invoked to provide a clean JSON
     *    representation
     * 2. **Structured error data**: When the server response body contains JSON,
     *    this method parses it and provides structured access to error details
     *
     * The method implements lazy parsing for the response message:
     *
     * - JSON parsing is attempted only on the first call to avoid unnecessary
     *   processing
     * - Successful parsing results are cached for subsequent calls
     * - If JSON parsing fails (e.g., for HTML error pages or plain text), the
     *   original string is preserved and returned as-is
     *
     * @template T The expected type of the response body (defaults to any for
     *   flexibility)
     * @returns A structured object containing all HTTP error information with the
     *   message field containing either the parsed JSON object or the original
     *   string
     */
    toJSON() {
        if (this.body_ === NOT_YET)
            try {
                this.body_ = JSON.parse(this.message);
            }
            catch (_a) {
                this.body_ = this.message;
            }
        return {
            method: this.method,
            path: this.path,
            status: this.status,
            headers: this.headers,
            message: this.body_,
        };
    }
}
exports.HttpError = HttpError;
/** @internal */
const NOT_YET = {};
