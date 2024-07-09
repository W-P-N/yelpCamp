class ExpressError extends Erros {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}

module.exports = ExpressError;
