// Type definitions for craftyjs
// Project: http://craftyjs.com/
// Definitions by: Gregory "Rory" Ksionda <https://github.com/ksiondag>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module CraftyJS {

    // General types
    type NotFunction = number|string|boolean|Array<any>|NotFunctionObject;

    interface NotFunctionObject {
        [index: string]: NotFunction;
    }

    interface Map {
        [index: string]: any;
    }

    // Crafty-specific types
    interface ComponentMap extends Map {
        // Stuff Crafty itself checks for
        init?(): void;
        required?: string;
    }

    interface TextMap {
        type?: string;
        weight?: string;
        size?: string;
        family?: string;
        lineHeight?: string;
        variant?: string;
    }

    // Function types
    interface DefineScene {
        (name: string, init: (data?: any) => void, uninit?: () => void): void;
    }

    interface EnterScene {
        (name: string, data?: NotFunction): void;
    }

    interface DefineOrEnterScene extends DefineScene, EnterScene {
    }

    // Crafty's functions
    interface Static {
        (selector: string): AnyEntity;
        (id: number): AnyEntity;

        init(width: number, height: number, divId: string): void;

        e(...components: string[]): AnyEntity;
        c(name: string, definition: ComponentMap): void;

        // Repeated definitions here because Function Types can't be overloaded
        scene: DefineOrEnterScene;
        defineScene: DefineScene;
        enterScene: EnterScene;
    }

    // All entities have these properties
    interface Core<T> {
        addComponent(...components: string[]): void;
        requires(components: string): void;

        // Getting values
        attr(property: string): any;

        // Chaining Functions
        //  // Setting values
        attr(prop: string, val: any, silent?: boolean, recursive?: boolean): T;
        attr(map: Map, silent?: boolean, recursive?: boolean): T;

        // // Event binding
        bind(eventName: 'MouseOver', callback: (event: MouseEvent) => void);
        bind(eventName: 'MouseOut', callback: (event: MouseEvent) => void);
        bind(eventName: 'MouseDown', callback: (event: MouseEvent) => void);
        bind(eventName: 'MouseUp', callback: (event: MouseEvent) => void);
        bind(eventName: 'Click', callback: (event: MouseEvent) => void);
        bind(eventName: 'DoubleClick', callback: (event: MouseEvent) => void);
        bind(eventName: 'MouseMove', callback: (event: MouseEvent) => void);

        bind(eventName: string, callback: (...data: any[]) => void);
    }

    interface TextComponent<T> extends Core<T> {
        text(value: string): T;
        textColor(color: string): T;
        textFont(key: string, value: string): T;
        textFont(value: TextMap): T;
        unselectable(): T;
    }

    interface ColorComponent<T> extends Core<T> {
        color(value: string, strength?: number): T;
        color(red: number, green: number, blue: number, strength?: number): T;
        color(): string;
    }

    interface FourwayComponent<T> extends MotionComponent<T>, Core<T> {
        fourway(speed: number): T;
    }

    interface MotionComponent<T> extends Core<T> {
        resetMotion(): T;
        motionDelta(): {x: number, y: number};
        velocity(): {x: number, y: number};
        acceleration(): {x: number, y: number};
        vx: number;
        vy: number;
        ax: number;
        ay: number;
    }

    /*
    Entities could have any number of defined functions depending on their
    components
    */
    interface AnyEntity extends
        TextComponent<AnyEntity>,
        ColorComponent<AnyEntity>,
        FourwayComponent<AnyEntity>,
        MotionComponent<AnyEntity>,
        Core<AnyEntity>
    {
    }
}

declare var Crafty: CraftyJS.Static;

