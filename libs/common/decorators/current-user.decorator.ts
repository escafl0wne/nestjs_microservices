import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserDocument } from "../../../apps/auth/src/users/models/users.schema";

function getCurrentUserByContext(context:ExecutionContext):UserDocument{
    return context.switchToHttp().getRequest().user;
}

export const CurrentUser = createParamDecorator(
    (data:unknown, context:ExecutionContext) => getCurrentUserByContext(context)
)