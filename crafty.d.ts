// Type definitions for craftyjs
// Project: http://craftyjs.com/
// Definitions by: Gregory "Rory" Ksionda <https://github.com/ksiondag>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module CraftyJS {

    interface DefineScene {
        (name: string, init: (data?: any) => void, uninit?: () => void): void;
    }

    type NotFunction = number|string|boolean|Array<any>;
    interface NotFunctionObject {
        [index: string]: NotFunction;
    }
    interface EnterScene {
        (name: string, data?: NotFunction|NotFunctionObject): void;
    }

    interface DefineOrEnterScene extends DefineScene, EnterScene {
    }

    interface Static {
        (selector: string): AnyEntity;
        (id: number): AnyEntity;

        init(width: number, height: number, divId: string): void;

        e(...components: string[]): AnyEntity;
        c(name: string, definition: Component): void;

        // Repeated definitions here because Function Types can't be overloaded
        scene: DefineOrEnterScene;
        defineScene: DefineScene;
        enterScene: EnterScene;

    }

    interface Component {
        // Stuff Crafty itself checks for
        init?(): void;
        required?: string;

        // Components are user-defined objects that plug into entities
        // Very flexible creation
        [index: string]: any;
    }

    /*
    All entities have these properties
    */
    interface Core<T> {
        addComponent(...components: string[]): void;
        requires(components: string): void;

        // Setting values
        attr(property: string, value: any, silent?: boolean, recursive?: boolean): T;
        attr(map: Object, silent?: boolean, recursive?: boolean): T;

        // Getting values
        attr(property: string): any;
    }

    interface TextComponent<T> extends Core<T> {
        text(value: string): T;
        textFont(value: TextFont): T;
    }

    /*
    Entities could have any number of defined functions depending on their
    components
    */
    interface AnyEntity extends TextComponent<AnyEntity>, Core<AnyEntity> {
    }

    interface TextFont {
        size?: string
    }
}

declare var Crafty: CraftyJS.Static;

