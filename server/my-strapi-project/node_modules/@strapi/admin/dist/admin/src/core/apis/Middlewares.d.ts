import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store/configure';
type TypedMiddleware = () => Middleware<object, RootState>;
declare class Middlewares {
    middlewares: Array<TypedMiddleware>;
    constructor();
    add(middleware: TypedMiddleware): void;
}
export { Middlewares, TypedMiddleware as Middleware };
