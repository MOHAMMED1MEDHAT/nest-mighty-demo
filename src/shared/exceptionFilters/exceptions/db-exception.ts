import { DBExceptionTypes } from '../enums/db-exception-levels.enum';

export class DBException {
	constructor(public readonly type: DBExceptionTypes) {}
}
