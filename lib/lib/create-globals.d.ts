declare const createGlobals: () => Globals;
type Globals = {
    set: (key: string, value: any) => void;
    get: (key: string) => any;
};

export { type Globals, createGlobals };
