export class CustomException extends Error {
	constructor(public readonly message: string) {
		super(message + '/ CustomException /');
	}
}
