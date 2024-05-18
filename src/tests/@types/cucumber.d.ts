declare module 'cucumber' {
    export function Given(pattern: RegExp | string, options: any, code: (...args: any[]) => void): void;
    export function Given(pattern: RegExp | string, code: (...args: any[]) => void): void;

    export function When(pattern: RegExp | string, options: any, code: (...args: any[]) => void): void;
    export function When(pattern: RegExp | string, code: (...args: any[]) => void): void;

    export function Then(pattern: RegExp | string, options: any, code: (...args: any[]) => void): void;
    export function Then(pattern: RegExp | string, code: (...args: any[]) => void): void;

    export interface World {
        [key: string]: any;
    }

    export function setWorldConstructor(world: new () => World): void;
}
