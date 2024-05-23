import { InternalExceptionTypes } from '../enums/internal-exception-levels.enum';

export class InternalException {
	constructor(public readonly type: InternalExceptionTypes) {}
}
