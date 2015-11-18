// Type definitions for craftyjs
// Project: http://craftyjs.com/
// Definitions by: Gregory "Rory" Ksionda <https://github.com/ksiondag>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module CraftyJS {

    interface Static {
        (value: string): AnyEntity;
        init(width: number, height: number, div_id: string): void;
        e(components: string): AnyEntity;
    }

    /*
    Entities could have any number of defined functions
    */
    interface AnyEntity {
        attr?(attribute: Attribute): AnyEntity;
        text?(value: string): AnyEntity;
        textFont?(value: TextFont): AnyEntity;
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

declare var Crafty: CraftyJS.Static;
