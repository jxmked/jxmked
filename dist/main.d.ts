declare module "globals" {
    const envRes: Map<string, any>;
    export { envRes };
    export const localforage: LocalForage;
    export const env_mode: "prod" | "dev";
    const _default: () => void;
    export default _default;
}
declare module "modules/createElement" {
    type CreateElementName = string;
    type CreateElementAttributes = {
        [id: string]: any;
    };
    class CreateElement {
        private element;
        private attr?;
        constructor(name: CreateElementName, attr?: CreateElementAttributes);
        private checkout_attributes;
        get html(): HTMLElement;
    }
    export { CreateElement };
    const _default_1: (name: CreateElementName, attr?: CreateElementAttributes) => HTMLElement;
    export default _default_1;
}
declare module "modules/label" {
    interface LabelProperties {
        title: string;
        tooltip?: string;
    }
    class Label {
        private title;
        private tooltip?;
        constructor(attributes: LabelProperties);
        private __normalize;
        private __get_tooltip;
        get html(): HTMLElement;
    }
    export default Label;
}
declare module "modules/get_repos" {
    type getRepoProperties = (arg: RepoProperties[]) => void;
    export default class getRepo {
        private static url;
        private thenCallback;
        private catchCallback;
        constructor();
        then(callback: getRepoProperties): this;
        catch(callback: any): this;
    }
}
declare module "known-languages/Known_Lang" {
    export default class Known_Lang {
        private static PLACEMENT;
        private static BASE;
        private static CONTAINER;
        private static TEXT_CONTAINER;
        private COUNTED_LANGS;
        constructor();
        __calculate(repos: RepoProperties[]): void;
        display_loading_screen(): Promise<void>;
        catch(err: any): void;
    }
}
declare module "main" { }
declare module "known-languages/bar-graph" {
    export default class BarGraph {
        private name;
        private value;
        constructor(name: string, value: number);
        set Name(name: string);
        set Value(value: number);
        get html(): HTMLElement;
    }
}
declare module "known-languages/bullet" {
    export default class Bullet {
        constructor(lang: string);
    }
}
declare module "known-languages/language" { }
declare module "modules/get-lang-colors" {
    export default class Get_Colors {
        private static url;
        private static __loaded_colors;
        private thenCallback;
        private catchCallback;
        private static __is_success;
        constructor();
        get success(): boolean;
        getColor(lang: string): string;
        then(callback: Function): void;
        catch(callback: Function): void;
    }
}
