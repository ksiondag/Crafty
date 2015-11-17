// Type definitions for craftyjs
// Project: http://craftyjs.com/
// Definitions by: Gregory "Rory" Ksionda <https://github.com/ksiondag>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module Crafty {
    export function init(width: number, height: number, div_id: string): void;

    export function e(components: string): Entity;

    interface Entity {
        attr(attribute: Attribute): Entity;
        text?(value: string): Entity;
        textFont?(value: TextFont): Entity;
    }

    interface Attribute {
        x: number,
        y: number,
        h?: number,
        w?: number
    }

    interface TextFont {
        size?: string
    }
}


