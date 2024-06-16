
export enum ErrorCodes {
	internalError = "INTERNAL_ERROR"
}

export interface FormattedError {
	errors: ErrorObject[];
}


export interface ErrorObject {
	code: string;
	message: string;
	field?: string;
}


export interface GenericErrorObject {
	code: ErrorCodes;
	error: Error;
	errorCode: number;
}
