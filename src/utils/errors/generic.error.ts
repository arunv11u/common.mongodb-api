import { CustomError, ErrorObject } from "@arunvaradharajalu/common.errors";
import { ErrorCodes, GenericErrorObject } from "../types/errors";


export class GenericError extends CustomError<ErrorCodes> {
	statusCode;
	code: ErrorCodes;
	constructor(public error: GenericErrorObject) {
		super(error.error.message);

		this.statusCode = error.errorCode;
		this.code = error.code;

		Object.setPrototypeOf(this, GenericError.prototype);
	}

	serializeErrors(): ErrorObject[] {
		const { error } = this.error;
		return [{  code: this.code, message: error.message }];
	}
}
