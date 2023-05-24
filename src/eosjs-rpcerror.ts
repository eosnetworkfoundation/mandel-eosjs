/**
 * @module RPC-Error
 */
// copyright defined in eosjs/LICENSE.txt

/** Holds detailed error information */
export class RpcError extends Error {
  /** Detailed error information */
    public json: any;

    constructor(json: any) {
        if (json.error && json.error.details && json.error.details.length && json.error.details[0].message) {
            let errorMessage = json.error.details[0].message
            // errors typically have multiple messages
            if (json.error.details.length > 1) {
                for (let i = 1; i < json.error.details.length; i++) {
                    errorMessage = errorMessage + '\n' + json.error.details[i].message
                }
            }
            super(errorMessage);
        } else if (json.processed && json.processed.except && json.processed.except.message) {
            super(json.processed.except.message);
        } else {
            super(json.message);
        }
        Object.setPrototypeOf(this, RpcError.prototype);
        this.json = json;
    }
}
