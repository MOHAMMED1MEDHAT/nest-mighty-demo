import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUserGql = createParamDecorator(
	(data: string, ctx: ExecutionContext) => {
		const gqlCtx = GqlExecutionContext.create(ctx);
		const res = gqlCtx.getContext().res;
		return data ? res.locals?.user[data] : res.locals?.user;
	},
);
