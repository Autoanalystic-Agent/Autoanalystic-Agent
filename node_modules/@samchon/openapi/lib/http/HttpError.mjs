class HttpError extends Error {
    constructor(method, path, status, headers, message) {
        super(message);
        this.body_ = NOT_YET;
        this.method = method;
        this.path = path;
        this.status = status;
        this.headers = headers;
        const proto = new.target.prototype;
        if (Object.setPrototypeOf) Object.setPrototypeOf(this, proto); else this.__proto__ = proto;
    }
    toJSON() {
        if (this.body_ === NOT_YET) try {
            this.body_ = JSON.parse(this.message);
        } catch {
            this.body_ = this.message;
        }
        return {
            method: this.method,
            path: this.path,
            status: this.status,
            headers: this.headers,
            message: this.body_
        };
    }
}

const NOT_YET = {};

export { HttpError };
//# sourceMappingURL=HttpError.mjs.map
