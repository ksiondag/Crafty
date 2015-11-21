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
        // // // Mouse
        bind(eventName: 'MouseOver', callback: (event: MouseEvent) => void): T;
        bind(eventName: 'MouseOut', callback: (event: MouseEvent) => void): T;
        bind(eventName: 'MouseDown', callback: (event: MouseEvent) => void): T;
        bind(eventName: 'MouseUp', callback: (event: MouseEvent) => void): T;
        bind(eventName: 'Click', callback: (event: MouseEvent) => void): T;
        bind(eventName: 'DoubleClick', callback: (event: MouseEvent) => void): T;
        bind(eventName: 'MouseMove', callback: (event: MouseEvent) => void): T;

        // // // Keyboard
        bind(eventName: 'KeyDown', callback: (event: KeyboardEvent) => void): T;
        bind(eventName: 'KeyUp', callback: (event: KeyboardEvent) => void): T;

        // // // Collision
        bind(eventName: 'HitOn', callback: (data: CollisionObject[]) => void): T;
        bind(eventName: 'HitOff', callback: () => void): T;

        // // // Generic
        bind(eventName: string, callback: (...data: any[]) => void): T;

        // Destroy
        destroy(): void;
    }

    interface TwoDComponent<T> extends Core<T> {
        x: number;
        y: number;
        h: number;
        w: number;
        z: number;
        rotation: number;
        alpha: number;
        visible: boolean;
    }

    interface KeyboardComponent<T> extends Core<T> {
        isDown(key: string): boolean;
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

    interface MotionComponent<T> extends TwoDComponent<T>, Core<T> {
        resetMotion(): T;
        motionDelta(): {x: number, y: number};
        velocity(): {x: number, y: number};
        acceleration(): {x: number, y: number};
        vx: number;
        vy: number;
        ax: number;
        ay: number;
    }

    interface FourwayComponent<T> extends MotionComponent<T>, Core<T> {
        fourway(speed: number): T;
    }

    interface CollisionObject {
        obj: AnyEntity;
        type: string;
        overlap: number;
    }
    interface CollisionCallback {
        (collisionObject: CollisionObject): void
    }
    interface CollisionComponent<T> extends TwoDComponent<T>, Core<T> {
        // TODO: CraftyJS.polygon definition
        collision(coordinatePairs: number[]): T;

        // TODO: CraftyJS.collision object interface
        hit(component: string): boolean|CollisionObject[];

        // TODO: Verify callOff function definition
        onHit(comp: string, callOn: CollisionCallback[], callOff: () => void): T;

        checkHits(componentList: string): T;
        checkHits(...componentList: string[]): T;
    }

    /*
    Entities could have any number of defined functions depending on their
    components
    */
    interface AnyEntity extends
        TwoDComponent<AnyEntity>,
        TextComponent<AnyEntity>,
        ColorComponent<AnyEntity>,
        FourwayComponent<AnyEntity>,
        MotionComponent<AnyEntity>,
        Core<AnyEntity>
    {
    }
}

declare var Crafty: CraftyJS.Static;

