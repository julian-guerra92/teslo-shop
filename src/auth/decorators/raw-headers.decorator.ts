import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException
} from "@nestjs/common";

export const RawHeaders = createParamDecorator(
    (data: string, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        const rawHeaders = req.rawHeaders;
        if (!rawHeaders)
            throw new InternalServerErrorException('RawHeaders not found (request)');
        return rawHeaders;
    }
);

/*
Este decorador es mejor dejarlo en el módulo common. Se deja acá en el curso por temas prácticos.
*/