import { ExceptionLevels } from './enums/exception-levels.enum';

export class CustomException extends Error {
	constructor(
		public readonly message: string,
		public readonly level: ExceptionLevels,
	) {
		message += ` - ${level}`;
		super(message);
	}
}
