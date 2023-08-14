import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";

export function addRequestDataValidationTo(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe( {
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY, // 422
    transform: true, // Para convertir el tipo de fuel a uppercase (que sea case insensitive)
    enableDebugMessages: true, // Para ver los mensajes de error
  } ));
}

type PickMatching<T, V> =
    { [K in keyof T as T[K] extends V ? K : never]: T[K] };

export type PublicMethodsOf<T> = PickMatching<T, Function>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function neverCheckError(value: never) {
  return new Error("no never value");
}
